import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import TaskCard from '../../../components/TaskCard';
import FilterList from '../../../components/FilterList';
import PerformerModal from '../../../components/PerformerModal';
import PhaseColumn from './PhaseColumn';
import Input from '../../../components/Input';
import SelectDropdown from '../../../components/SelectDropdown';
import Button from '../../../components/Button';
import Priority from '../../../components/Priority';
import Checkbox from '../../../components/Checkbox';
import CreateTaskModal from '../../../components/CreateTaskModal';
import PerformerFilter from '../../../components/PerformerFilter';
import getPriorityById from '../../../utils/TaskPriority';
import * as css from './AgileBoard.scss';
import { UnmountClosed } from 'react-collapse';
import localize from './AgileBoard.json';
import { getFullName, getDictionaryName } from '../../../utils/NameLocalisation';

import getTasks from '../../../actions/Tasks';
import { VISOR, EXTERNAL_USER } from '../../../constants/Roles';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo } from '../../../actions/Project';
import { history } from '../../../History';
import { createSelector } from 'reselect';

const selectTasks = state => state.Tasks.tasks;

const selectSprints = state => state.Project.project.sprints;

const selectUserId = state => state.Auth.user.id;

const selectTaskType = state => state.Dictionaries.taskTypes;

const selectProjectUsers = state => state.Project.project.users;

const filterTasks = array => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };
  array.forEach(element => {
    switch (element.statusId) {
      case 1:
        taskArray.new.push(element);
        break;
      case 2:
      case 3:
        taskArray.dev.push(element);
        break;
      case 4:
      case 5:
        taskArray.codeReview.push(element);
        break;
      case 6:
      case 7:
        taskArray.qa.push(element);
        break;
      case 8:
        taskArray.done.push(element);
        break;
      default:
        break;
    }
  });

  for (const key in taskArray) {
    taskArray[key].sort((a, b) => {
      return a.prioritiesId - b.prioritiesId;
    });
    taskArray[key].forEach(task => {
      if (!task.linkedTasks) {
        task.linkedTasks = [];
      }
      task.linkedTasks.concat(task.subTasks, task.parentTask).map(relatedTask => _.get(relatedTask, 'id', null));
    });
  }

  return taskArray;
};

const getSortedTasks = createSelector([selectTasks], tasks => filterTasks(tasks));

const myTasks = (tasks, userId) =>
  tasks.filter(task => {
    return task.performer && task.performer.id === userId;
  });

const getMyTasks = createSelector([selectTasks, selectUserId], (tasks, userId) => filterTasks(myTasks(tasks, userId)));

const getTagsByTask = tasks => {
  let allTags = tasks.reduce((arr, task) => {
    return arr.concat(task.tags ? task.tags.map(tags => tags.name) : []);
  }, []);

  allTags = _.uniq(allTags);

  return allTags.map(tag => ({
    value: tag,
    label: tag
  }));
};

const getAllTags = createSelector([selectTasks], tasks => getTagsByTask(tasks));

const getSprints = unsortedSprints => {
  let sprints = _.sortBy(unsortedSprints, sprint => {
    return new moment(sprint.factFinishDate);
  });

  sprints = sprints.map(sprint => ({
    value: sprint.id,
    label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${
      sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}` : '- ...'
    })`,
    statusId: sprint.statusId,
    className: classnames({
      [css.INPROGRESS]: sprint.statusId === 2,
      [css.sprintMarker]: true,
      [css.FINISHED]: sprint.statusId === 1
    })
  }));

  sprints.push({
    value: 0,
    label: 'Backlog',
    className: classnames({
      [css.INPROGRESS]: false,
      [css.sprintMarker]: true
    })
  });
  return sprints;
};

const getSortedSprints = createSelector([selectSprints], sprints => getSprints(sprints));

const currentSprint = sprints => {
  const processedSprints = sprints.filter(sprint => {
    return sprint.statusId === 2;
  });

  const currentSprints = processedSprints.filter(sprint => {
    return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
  });

  return currentSprints.length ? currentSprints[0].id : processedSprints.length ? processedSprints[0].id : 0;
};

const getCurrentSprint = createSelector([selectSprints], sprints => currentSprint(sprints));

const createOptions = (array, labelField) => {
  return array.map(element => ({
    value: element.id,
    label: labelField === 'name' ? element[labelField] : getFullName(element)
  }));
};

const typeOptions = taskTypes => createOptions(taskTypes, 'name');
const authorOptions = projectUsers => createOptions(projectUsers);

const getTypeOptions = createSelector([selectTaskType], taskTypes => typeOptions(taskTypes));
const getAuthorOptions = createSelector([selectProjectUsers], projectUsers => authorOptions(projectUsers));

const phaseColumnNameById = {
  1: 'New',
  2: 'Dev',
  3: 'Dev',
  4: 'Code Review',
  5: 'Code Review',
  6: 'QA',
  7: 'QA',
  8: 'Done',
  9: 'Canceled',
  10: 'Closed'
};

const sortTasksAndCreateCard = (
  sortedObject,
  section,
  onChangeStatus,
  onOpenPerformerModal,
  myTaskBoard,
  isExternal,
  lightTask,
  lightedTaskId,
  isCardFocus
) => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };

  for (const key in sortedObject) {
    taskArray[key] = sortedObject[key].map(task => {
      const lightedRelatedTask = task.linkedTasks.includes(lightedTaskId);
      const lighted = task.id === lightedTaskId && isCardFocus;

      return (
        <TaskCard
          task={task}
          lightTask={lightTask}
          lighted={lighted}
          lightedTaskId={lightedRelatedTask && !isCardFocus ? lightedTaskId : null}
          key={`task-${task.id}`}
          section={section}
          isExternal={isExternal}
          onChangeStatus={onChangeStatus}
          onOpenPerformerModal={onOpenPerformerModal}
          myTaskBoard={myTaskBoard}
        />
      );
    });
  }
  return taskArray;
};

const getNewStatus = (oldStatusId, newPhase) => {
  let newStatusId;

  switch (newPhase) {
    case 'New':
      newStatusId = 1;
      break;
    case 'Dev':
      newStatusId = 3;
      break;
    case 'Code Review':
      newStatusId = 5;
      break;
    case 'QA':
      newStatusId = 7;
      break;
    case 'Done':
      newStatusId = 8;
      break;
    default:
      break;
  }

  return newStatusId;
};

const getNewStatusOnClick = oldStatusId => {
  let newStatusId;

  if (oldStatusId === 2 || oldStatusId === 4 || oldStatusId === 6) {
    newStatusId = oldStatusId + 1;
  } else if (oldStatusId === 3 || oldStatusId === 5 || oldStatusId === 7) {
    newStatusId = oldStatusId - 1;
  }

  return newStatusId;
};

class AgileBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightedTaskId: null,
      isCardFocus: false,
      isModalOpen: false,
      performer: null,
      changedTask: null,
      allFilters: [],
      fullFilterView: this.getFilterViewState(),
      changedFilters: {},
      ...this.initialFilters,
      ...this.getQueryFiltersFromUrl()
    };
  }

  componentDidMount() {
    if (this.props.myTaskBoard) {
      this.selectValue(this.getChangedSprint(this.props), 'changedSprint');
    }
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();
    if (this.props.tracksChange !== nextProps.tracksChange && this.props.project.id) {
      this.props.getProjectInfo(this.props.project.id);
    }

    if (
      (this.props.sprints !== nextProps.sprints || this.props.lastCreatedTask !== nextProps.lastCreatedTask) &&
      nextProps.project.id
    ) {
      this.selectValue(this.getChangedSprint(nextProps), 'changedSprint');
    }

    if (nextProps.sprintTasks.length) {
      this.setState({
        isSectionOpen: {
          myTasks: true,
          allTasks: true
        }
      });
    } else {
      this.setState({
        isSectionOpen: {
          myTasks: false,
          allTasks: false
        }
      });
    }

    if (!nextProps.StatusIsEditing && this.props.StatusIsEditing) {
      this.selectValue(this.state.changedSprint, 'changedSprint');
    }
    if (!nextProps.UserIsEditing && this.props.UserIsEditing) {
      this.selectValue(this.state.changedSprint, 'changedSprint');
      this.setState({
        isModalOpen: false,
        performer: null,
        changedTask: null
      });
    }

    if (nextProps.lastUpdatedTask !== this.props.lastUpdatedTask) {
      this.getTasks();
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  translateToNumIfNeeded = value => {
    const re = /^\d+$/;
    return re.test(value) ? +value : value;
  };

  multipleQueries = queries => {
    if (Array.isArray(queries)) {
      return queries.map(queryValue => this.translateToNumIfNeeded(queryValue));
    }

    return queries ? [this.translateToNumIfNeeded(queries)] : [];
  };

  singleQuery = currentQuery => {
    return currentQuery ? this.translateToNumIfNeeded(currentQuery) : null;
  };

  makeNewObj = (name, value) => {
    if (!!value && !Array.isArray(value)) {
      return { [name]: this.singleQuery(value) };
    }
    if (!!value && Array.isArray(value)) {
      return { [name]: this.multipleQueries(value) };
    }
  };

  getUrlQueries = () => {
    if (!this.props.myTaskBoard) {
      const { performerId, name, authorId, prioritiesId, typeId, filterTags, isOnlyMine, changedSprint } =
        (this.props.location && this.props.location.query) || {};
      return {
        ...this.makeNewObj('performerId', performerId),
        ...this.makeNewObj('name', name),
        ...this.makeNewObj('authorId', authorId),
        ...this.makeNewObj('prioritiesId', prioritiesId),
        ...this.makeNewObj('filterTags', filterTags),
        ...this.makeNewObj('typeId', typeId),
        ...this.makeNewObj('isOnlyMine', isOnlyMine),
        ...this.makeNewObj('changedSprint', changedSprint)
      };
    }
  };

  getQueryFiltersFromUrl() {
    if (!this.props.myTaskBoard) {
      const projectId = this.props.params.projectId;
      return {
        ...this.getUrlQueries(),
        changedFilters: {
          projectId,
          ...this.getUrlQueries()
        }
      };
    }
  }

  changeUrl(changedFilters) {
    if (!this.props.myTaskBoard) {
      const query = {};

      for (const [key, value] of Object.entries(changedFilters)) {
        if (value && key !== 'projectId') {
          query[key] = value;
        }
      }

      history.replace({
        ...this.props.location,
        query
      });
    }
  }

  initialFilters = {
    isOnlyMine: false,
    changedSprint: null,
    filterTags: [],
    typeId: [],
    name: null,
    authorId: null,
    prioritiesId: null,
    performerId: null
  };

  getChangedSprint = props => {
    let changedSprint = this.state.changedSprint !== null ? this.state.changedSprint : this.props.currentSprint;
    if (props.lastCreatedTask && Number.isInteger(props.lastCreatedTask.sprintId)) {
      changedSprint = props.lastCreatedTask.sprintId;
    }

    return changedSprint;
  };

  toggleFilterView = () => {
    this.setState({
      fullFilterView: !this.state.fullFilterView
    });
  };

  getFilterViewState = () => {
    try {
      return JSON.parse(localStorage.getItem('filterViewState')) || false;
    } catch (e) {
      return false;
    }
  };

  toggleMine = () => {
    this.setState(
      currentState => ({
        isOnlyMine: !currentState.isOnlyMine
      }),
      () => {
        this.setFiltersToUrl('isOnlyMine', this.state.isOnlyMine, this.updateFilterList);
      }
    );
  };

  setFiltersToUrl = (name, e, callback) => {
    this.setState(state => {
      let filterValue = e;
      const changedFilters = { ...state.changedFilters };

      if (!this.props.myTaskBoard) {
        changedFilters.projectId = this.props.params.projectId;
      }

      if (name === 'typeId') {
        filterValue = e.map(singleValue => singleValue.value);
      }

      if (name === 'performerId') {
        filterValue = e.map(singleValue => singleValue.value);
      }

      if (name === 'filterTags') {
        filterValue = e.map(singleValue => singleValue.value).join(',');
      }

      if (~[null, [], undefined, ''].indexOf(filterValue)) {
        delete changedFilters[name];
      } else {
        changedFilters[name] = filterValue;
      }

      this.changeUrl(changedFilters);

      return {
        [name]: filterValue,
        changedFilters
      };
    }, callback);
  };

  selectValue = (e, name) => {
    this.setFiltersToUrl(name, e, () => {
      if (this.props.myTaskBoard) return this.getTasks({ performerId: this.props.user.id });
      this.getTasks();
    });
  };

  getTasks = customOption => {
    const options = customOption
      ? customOption
      : {
          projectId: this.props.params.projectId,
          sprintId: this.state.changedSprint,
          prioritiesId: this.state.prioritiesId,
          authorId: this.state.authorId,
          typeId: this.state.typeId,
          name: this.state.name || null,
          tags: this.state.filterTags,
          performerId: this.state.performerId
        };
    this.props.getTasks(options);
    this.updateFilterList();
  };

  selectTagForFiltrated = options => {
    this.selectValue(options, 'filterTags');
  };

  dropTask = (task, phase) => {
    if (phaseColumnNameById[task.statusId] === phase) return;
    if (!(phase === 'New' || phase === 'Done')) {
      const taskProps = this.props.sprintTasks.find(sprintTask => {
        return task.id === sprintTask.id;
      });
      const performerId = taskProps.performerId || null;
      const projectId = taskProps.projectId || null;
      this.openPerformerModal(task.id, performerId, projectId, task.statusId, phase);
    } else {
      this.changeStatus(task.id, task.statusId, phase);
    }
  };

  changeStatus = (taskId, statusId, phase, performerId) => {
    const params = {
      id: taskId,
      statusId: phase ? getNewStatus(statusId, phase) : getNewStatusOnClick(statusId)
    };

    if (performerId === 0) {
      params.performerId = performerId;
    }

    this.props.changeTask(params, 'Status');
    this.props.startTaskEditing('Status');
  };

  openPerformerModal = (taskId, performerId, projectId, statusId, phase) => {
    if (this.props.myTaskBoard) {
      this.props.getProjectUsers(projectId);
    }
    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: taskId,
      statusId,
      phase
    });
  };

  changePerformer = performerId => {
    this.props.changeTask(
      {
        id: this.state.changedTask,
        performerId: performerId,
        statusId: getNewStatus(this.state.statusId, this.state.phase)
      },
      'User'
    );

    this.props.startTaskEditing('User');
  };

  closeModal = performerId => {
    this.setState(
      {
        isModalOpen: false
      },
      () => this.changeStatus(this.state.changedTask, this.state.statusId, this.state.phase, performerId)
    );
  };

  getSprintTime = sprintId => {
    if (!sprintId) return false;
    let currentSprint = {};
    this.props.sprints.forEach(sprint => {
      if (sprint.id === sprintId) {
        currentSprint = sprint;
      }
    });
    return `${currentSprint.spentTime || 0} / ${currentSprint.riskBudget || 0}`;
  };

  getUsers = () => {
    return this.props.project.users.map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
  };

  resetFiled = name => {
    this.setState(
      () => ({
        [name]: this.initialFilters[name]
      }),
      this.getTasks
    );
  };

  removeSelectOptionByIdFromFilter = (list, id, filterField) => {
    const newList = list.filter(item => item.value !== id);
    this.setState(
      {
        [filterField]: newList
      },
      this.getTasks
    );
  };

  filterIsNotEmpty = filterName => {
    if (
      typeof this.state[filterName] === 'string' ||
      this.state[filterName] instanceof String ||
      Array.isArray(this.state[filterName])
    ) {
      return this.state[filterName].length > 0;
    }
    return this.state[filterName] !== null && this.state[filterName] !== false;
  };

  createFilterLabel = filterName => {
    switch (filterName) {
      case 'isOnlyMine':
        return 'мои задачи';
      case 'prioritiesId':
        return `${getPriorityById(this.state.prioritiesId)}`;
      case 'authorId':
        return `автор: ${this.createSelectedOption(this.props.project.users, this.state.authorId, 'fullNameRu')}`;
      case 'performerId':
        return `исполнитель: ${this.createSelectedOption(
          this.props.project.users,
          this.state.performerId,
          'fullNameRu'
        ) || 'Не назначено'}`;
      case 'changedSprint':
        return `${this.createSelectedOption(
          this.props.sortedSprints.map(sprint => ({ id: sprint.value, name: sprint.label })),
          this.state.changedSprint
        )}`;
      case 'name':
        return `${this.state.name}`;
      default:
        return '';
    }
  };

  updateFilterList = () => {
    const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'changedSprint', 'name'];
    const selectedFilters = [];

    singleOptionFiltersList.forEach(filterName => {
      if (this.filterIsNotEmpty(filterName)) {
        selectedFilters.push({
          name: filterName,
          label: this.createFilterLabel(filterName),
          deleteHandler: () => this.resetFiled(filterName)
        });
      }
    });

    this.setState({
      allFilters: [
        ...selectedFilters,
        ...this.createSelectedOption([], this.state.typeId, 'typeId'),
        ...this.createSelectedOption([], this.state.performerId, 'performerId'),
        ...this.createSelectedOption([], this.state.filterTags, 'filterTags')
      ]
    });
  };

  createSelectedOption = (optionList, selectedOption, optionLabel = 'name') => {
    if (Array.isArray(selectedOption)) {
      return selectedOption.map(currentId => ({
        name: `${optionLabel}-${currentId.value}`,
        label: currentId.label,
        deleteHandler: () => {
          this.removeSelectOptionByIdFromFilter(selectedOption, currentId.value, optionLabel);
        }
      }));
    } else {
      const option = optionList.find(element => element.id === selectedOption);
      if (!option) return {};
      return option[optionLabel];
    }
  };

  clearFilter = () => {
    this.setState(
      {
        ...this.initialFilters
      },
      () => {
        this.getTasks({
          projectId: this.props.params.projectId,
          sprintId: null,
          ...this.initialFilters
        });
      }
    );
  };

  deleteTag = label => {
    this.setState(
      {
        filterTags: this.state.filterTags
          .split(',')
          .filter(el => el !== label)
          .join()
      },
      this.getTasks
    );
  };

  toOptionArray = (str, name) => {
    if (!Array.isArray(str) && str) {
      return str.split(',').map(el => {
        return {
          name: name,
          deleteHandler: () => this.deleteTag(el),
          label: el
        };
      });
    } else {
      return [];
    }
  };

  isFilterEmpty = () => {
    const filterKeys = [...Object.keys(this.initialFilters), 'isOnlyMine'];
    let isEmpty = true;
    filterKeys.forEach(key => {
      if (Array.isArray(this.state[key]) && this.state[key].length === 0) {
        return;
      } else if ([null, '', false].indexOf(this.state[key]) === -1) {
        isEmpty = false;
      }
    });
    return isEmpty;
  };

  lightTask = (lightedTaskId, isCardFocus) => {
    this.setState({ lightedTaskId, isCardFocus });
  };

  render() {
    const { taskTypes, project, lang } = this.props;

    const isVisor = this.props.globalRole === VISOR;
    const isExternal = this.props.globalRole === EXTERNAL_USER;

    const allSorted = sortTasksAndCreateCard(
      this.props.tasks,
      'all',
      this.changeStatus,
      this.openPerformerModal,
      this.props.myTaskBoard,
      isExternal,
      this.lightTask,
      this.state.lightedTaskId,
      this.state.isCardFocus
    );

    const mineSorted = sortTasksAndCreateCard(
      this.props.myTasks,
      'mine',
      this.changeStatus,
      this.openPerformerModal,
      this.props.myTaskBoard,
      isExternal,
      this.lightTask,
      this.state.lightedTaskId,
      this.state.isCardFocus
    );

    return (
      <section className={css.agileBoard}>
        {!this.props.myTaskBoard ? (
          <div>
            <UnmountClosed isOpened={this.state.fullFilterView} springConfig={{ stiffness: 90, damping: 15 }}>
              <div className={css.filtersRowWrapper}>
                <Row className={css.filtersRow}>
                  <Col className={css.filterButtonCol}>
                    <Priority
                      onChange={option => this.selectValue(option.prioritiesId, 'prioritiesId')}
                      priority={this.state.prioritiesId}
                      priorityTitle={localize[lang].PRIORITY}
                      canEdit
                    />
                  </Col>
                  <Col className={css.filterButtonCol}>
                    <Checkbox
                      checked={this.state.isOnlyMine}
                      onChange={this.toggleMine}
                      label={localize[lang].MY_TASKS}
                    />
                  </Col>
                  <Col xs style={{ minWidth: 200 }}>
                    <SelectDropdown
                      name="filterTags"
                      multi
                      placeholder={localize[lang].TAG_NAME}
                      backspaceToRemoveMessage=""
                      value={this.state.filterTags}
                      onChange={this.selectTagForFiltrated}
                      noResultsText="Нет результатов"
                      options={this.props.tags}
                    />
                  </Col>
                  {!isVisor ? (
                    <Col className={css.filterButtonCol}>
                      <Button
                        onClick={this.props.openCreateTaskModal}
                        type="primary"
                        text={localize[lang].CREATE_TASK}
                        icon="IconPlus"
                        name="right"
                      />
                    </Col>
                  ) : null}
                </Row>
                <Row className={css.filtersRow}>
                  <Col xs={12} sm={6}>
                    <Input
                      placeholder={localize[lang].TASK_NAME}
                      value={this.state.name || ''}
                      onChange={e => this.selectValue(e.target.value, 'name')}
                    />
                  </Col>
                  <Col xs={12} sm={3}>
                    <PerformerFilter
                      onPerformerSelect={options => this.selectValue(options, 'performerId')}
                      selectedPerformerId={this.state.performerId}
                    />
                  </Col>
                  <Col xs={12} sm={3}>
                    <SelectDropdown
                      name="type"
                      placeholder={localize[lang].TASK_TYPE}
                      multi
                      noResultsText={localize[lang].TYPE_IS_MISS}
                      backspaceToRemoveMessage={''}
                      clearAllText={localize[lang].CLEAR_ALL}
                      value={this.state.typeId}
                      options={this.props.typeOptions}
                      onChange={options => this.selectValue(options, 'typeId')}
                    />
                  </Col>
                </Row>
                <Row className={css.filtersRow}>
                  <Col xs={12} sm={6} className={css.changedSprint}>
                    <SelectDropdown
                      name="changedSprint"
                      placeholder={localize[lang].SELECT_SPRINT}
                      multi={false}
                      value={this.state.changedSprint}
                      onChange={e => this.selectValue(e !== null ? e.value : null, 'changedSprint')}
                      noResultsText={localize[lang].NO_RESULTS}
                      options={this.props.sortedSprints}
                    />
                    {!isExternal ? (
                      <span className={css.sprintTime}>{this.getSprintTime(this.state.changedSprint) || null}</span>
                    ) : null}
                  </Col>
                  <Col xs>
                    <SelectDropdown
                      name="author"
                      placeholder={localize[lang].SELECT_AUTHOR}
                      multi={false}
                      value={this.state.authorId}
                      onChange={option => this.selectValue(option ? option.value : null, 'authorId')}
                      noResultsText={localize[lang].NO_RESULTS}
                      options={this.props.authorOptions}
                    />
                  </Col>
                  <Col className={css.filterButtonCol}>
                    <Button
                      onClick={this.clearFilter}
                      type="primary"
                      text={localize[lang].CLEAR_FILTERS}
                      icon="IconBroom"
                      name="right"
                      disabled={this.isFilterEmpty()}
                    />
                  </Col>
                </Row>
              </div>
            </UnmountClosed>
            <Row className={css.filtersRow}>
              <Col xs={12} sm={12}>
                <FilterList
                  clearAll={this.clearFilter}
                  fullFilterView={this.state.fullFilterView}
                  toggleFilterView={this.toggleFilterView}
                  filters={[...this.state.allFilters, ...this.toOptionArray(this.state.filterTags, 'filterTags')]}
                  openCreateTaskModal={this.props.openCreateTaskModal}
                  isVisor={isVisor}
                />
              </Col>
            </Row>
          </div>
        ) : null}

        <div className={css.boardContainer}>
          {this.props.myTaskBoard || this.state.isOnlyMine ? (
            <Row>
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'New'} tasks={mineSorted.new} />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Dev'} tasks={mineSorted.dev} />
              <PhaseColumn
                onDrop={this.dropTask}
                section={'mine'}
                title={'Code Review'}
                tasks={mineSorted.codeReview}
              />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'QA'} tasks={mineSorted.qa} />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Done'} tasks={mineSorted.done} />
            </Row>
          ) : (
            <Row>
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'New'} tasks={allSorted.new} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Dev'} tasks={allSorted.dev} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Code Review'} tasks={allSorted.codeReview} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'QA'} tasks={allSorted.qa} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Done'} tasks={allSorted.done} />
            </Row>
          )}
        </div>

        {this.state.isModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closeModal}
            title={localize[lang].CHANGE_PERFORMER}
            users={this.getUsers()}
          />
        ) : null}
        {this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal
            selectedSprintValue={this.state.changedSprint}
            project={this.props.project}
            defaultPerformerId={this.state.performerId}
          />
        ) : null}
      </section>
    );
  }
}

AgileBoard.propTypes = {
  StatusIsEditing: PropTypes.bool,
  UserIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  getProjectInfo: PropTypes.func,
  getProjectUsers: PropTypes.func,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  lastCreatedTask: PropTypes.object,
  lastUpdatedTask: PropTypes.object,
  location: PropTypes.object,
  myTaskBoard: PropTypes.bool,
  openCreateTaskModal: PropTypes.func.isRequired,
  params: PropTypes.object,
  project: PropTypes.object,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array,
  startTaskEditing: PropTypes.func,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array,
  tasks: PropTypes.object,
  myTasks: PropTypes.object,
  tags: PropTypes.array,
  sortedSprints: PropTypes.array,
  currentSprint: PropTypes.number,
  typeOptions: PropTypes.array,
  authorOptions: PropTypes.array,
  tracksChange: PropTypes.number,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  tasks: getSortedTasks(state),
  myTasks: getMyTasks(state),
  tags: getAllTags(state),
  sortedSprints: getSortedSprints(state),
  currentSprint: getCurrentSprint(state),
  typeOptions: getTypeOptions(state),
  authorOptions: getAuthorOptions(state),
  lastCreatedTask: state.Project.lastCreatedTask,
  lastUpdatedTask: state.Task.lastUpdatedTask,
  sprintTasks: state.Tasks.tasks,
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  tracksChange: state.TimesheetPlayer.tracksChange,
  StatusIsEditing: state.Task.StatusIsEditing,
  UserIsEditing: state.Task.UserIsEditing,
  user: state.Auth.user,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  globalRole: state.Auth.user.globalRole,
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  getProjectUsers,
  getProjectInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(AgileBoard);
