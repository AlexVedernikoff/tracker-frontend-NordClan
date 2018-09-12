import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
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
import { getFullName } from '../../../utils/NameLocalisation';
import { getAllTags } from '../../../selectors/getAllTags';

import getTasks from '../../../actions/Tasks';
import { VISOR, EXTERNAL_USER } from '../../../constants/Roles';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo, getProjectTags } from '../../../actions/Project';
import { history } from '../../../History';
import { createSelector } from 'reselect';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from '../../../selectors/dictionaries';
import SprintSelector from '../../../components/SprintSelector';

const selectTasks = state => state.Tasks.tasks;

const selectSprints = state => state.Project.project.sprints;

const selectUserId = state => state.Auth.user.id;

const selectTaskType = state => getLocalizedTaskTypes(state);

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
      task.linkedTasks.concat(task.subTasks, task.parentTask).map(relatedTask => get(relatedTask, 'id', null));
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

const NO_TAG_VALUE = -1;
const getNoTagData = createSelector(
  state => state.Localize.lang,
  lang => ({
    label: localize[lang].WITHOUT_TAG,
    value: NO_TAG_VALUE
  })
);

const parseTagsQuery = tagsQuery => {
  return tagsQuery ? tagsQuery.split(',').map(value => ({ label: value, value })) : [];
};

const getSprints = unsortedSprints => {
  let sprints = sortBy(unsortedSprints, sprint => {
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

const createOptions = (array, labelField) => {
  return array.map(element => ({
    value: element.id,
    label: labelField === 'name' ? element[labelField] : getFullName(element)
  }));
};

const getSortedSprints = createSelector([selectSprints], sprints => getSprints(sprints));

const currentSprint = sprints => {
  const processedSprints = sprints.filter(sprint => {
    return sprint.statusId === 2;
  });

  const currentSprints = processedSprints.filter(sprint => {
    return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
  });

  return createOptions(currentSprints.length ? currentSprints : processedSprints);
  // return currentSprints.length ? currentSprints[0].id : processedSprints.length ? processedSprints[0].id : 0;
};

const getCurrentSprint = createSelector([selectSprints], sprints => currentSprint(sprints));

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

const mapUrlMultiQuery = query => {
  return query ? (Array.isArray(query) ? query : [query]).map(value => ({ value })) : [];
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
    this.selectValue(this.getChangedSprint(this.props), 'changedSprint');
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();
    if (this.props.tracksChange !== nextProps.tracksChange && this.props.project.id) {
      this.props.getProjectInfo(this.props.project.id);
    }
    if (this.props.tags !== nextProps.tags && this.props.project.id) {
      this.props.getProjectTags(this.props.project.id);
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
      if (this.props.myTaskBoard) {
        this.getTasks({ performerId: this.props.user.id });
      } else {
        this.getTasks();
      }
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
    if (!!value && Array.isArray(value) && value.length) {
      return { [name]: this.multipleQueries(value) };
    }
  };

  getUrlQueries = () => {
    if (!this.props.myTaskBoard) {
      const { performerId, name, authorId, prioritiesId, typeId, filterTags, isOnlyMine, changedSprint, noTag } =
        (this.props.location && this.props.location.query) || {};
      return {
        ...this.makeNewObj('performerId', performerId),
        ...this.makeNewObj('name', name),
        ...this.makeNewObj('authorId', authorId),
        ...this.makeNewObj('prioritiesId', prioritiesId),
        ...this.makeNewObj('filterTags', parseTagsQuery(filterTags)),
        ...this.makeNewObj('noTag', noTag),
        ...this.makeNewObj('typeId', typeId),
        ...this.makeNewObj('isOnlyMine', isOnlyMine === 'true'),
        ...this.makeNewObj('changedSprint', mapUrlMultiQuery(changedSprint))
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
          if (key === 'performerId' || key === 'typeId' || key === 'changedSprint') {
            query[key] = Array.isArray(value) ? value.map(singleFilter => singleFilter.value) : value;
          } else if (key === 'filterTags') {
            query[key] = value.map(({ value }) => value).join(',');
          } else {
            query[key] = value;
          }
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
    changedSprint: [],
    filterTags: [],
    noTag: null,
    typeId: [],
    name: null,
    authorId: null,
    prioritiesId: null,
    performerId: null
  };

  getChangedSprint = props => {
    let changedSprint = this.state.changedSprint.length ? this.state.changedSprint : this.props.currentSprint;
    if (!this.props.myTaskBoard) {
      changedSprint =
        this.props.location.query.currentSprint === undefined
          ? this.state.changedSprint || []
          : [{ value: +this.props.location.query.currentSprint }];
    }
    if (props.lastCreatedTask && Number.isInteger(props.lastCreatedTask.sprintId)) {
      changedSprint = [{ value: props.lastCreatedTask.sprintId }];
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

  setFiltersToUrl = (name, e, callback) => {
    this.setState(state => {
      let filterValue = e;
      const changedFilters = { ...state.changedFilters };

      if (!this.props.myTaskBoard) {
        changedFilters.projectId = this.props.params.projectId;
      }

      if (name === 'filterTags' || name === 'performerId' || name === 'typeId') {
        filterValue = e;
      }

      if (~[null, undefined, ''].indexOf(filterValue) || (Array.isArray(filterValue) && !filterValue.length)) {
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
          sprintId: this.state.changedSprint ? this.state.changedSprint.map(singleType => singleType.value) : null,
          prioritiesId: this.state.prioritiesId,
          authorId: this.state.authorId,
          typeId: this.state.typeId
            ? Array.isArray(this.state.typeId)
              ? this.state.typeId.map(singleType => singleType.value)
              : this.state.typeId.value
            : null,
          name: this.state.name || null,
          tags: this.state.filterTags.map(({ value }) => value).join(','),
          noTag: this.state.noTag,
          performerId: this.state.performerId
            ? Array.isArray(this.state.performerId)
              ? this.state.performerId.map(singlePerformer => singlePerformer.value)
              : this.state.performerId.value
            : null
        };
    this.props.getTasks(options);
    this.updateFilterList();
  };

  selectTagForFiltrated = options => {
    const tags = options.filter(option => option.value !== NO_TAG_VALUE);
    const isNoTagSelected = tags.length < options.length;
    const { noTag } = this.state;

    if ((noTag && !isNoTagSelected) || (!noTag && isNoTagSelected)) {
      this.selectValue(isNoTagSelected || null, 'noTag');
    } else {
      this.selectValue(tags, 'filterTags');
    }
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

  getSprintTime(sprints) {
    return sprints && sprints.length && this.props.sprints.length
      ? sprints.map(sprint => {
          const sprintData = this.props.sprints.find(data => data.id === +sprint.value) || {};
          return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
        })
      : [];
  }

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
      case 'noTag':
        return this.props.noTagData.label;
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
      case 'name':
        return `${this.state.name}`;
      default:
        return '';
    }
  };

  updateFilterList = () => {
    const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name', 'noTag'];
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

    const changedSprint = this.state.changedSprint.map(sprint => {
      const option = this.props.sortedSprints.find(el => el.value === +sprint.value);
      return {
        ...sprint,
        ...option
      };
    });

    this.setState({
      allFilters: [
        ...selectedFilters,
        ...this.createSelectedOption([], changedSprint, 'changedSprint'),
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
        label: optionLabel === 'performerId' ? `исполнитель: ${currentId.label}` : currentId.label,
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
    this.changeUrl({ projectId: this.props.params.projectId });
    this.setState(
      {
        ...this.initialFilters
      },
      () => {
        this.getTasks({
          projectId: this.props.params.projectId,
          sprintId: 0,
          ...this.initialFilters
        });
      }
    );
  };

  deleteTag = value => {
    this.setState(
      {
        filterTags: this.state.filterTags.filter(el => el.value !== value)
      },
      this.getTasks
    );
  };

  toOptionArray = (arr, name) => {
    if (Array.isArray(arr)) {
      return arr.map(el => {
        return {
          name: name,
          deleteHandler: () => this.deleteTag(el.value),
          label: el.label
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
      } else if ([null, '', false, 0].indexOf(this.state[key]) === -1) {
        isEmpty = false;
      }
    });
    return isEmpty;
  };

  lightTask = (lightedTaskId, isCardFocus) => {
    this.setState({ lightedTaskId, isCardFocus });
  };

  getFilterTagsProps() {
    const { filterTags, noTag } = this.state;
    const { tags, noTagData } = this.props;
    return {
      value: !noTag ? filterTags : [noTagData].concat(filterTags),
      options: filterTags.length ? tags : [noTagData].concat(tags)
    };
  }

  onPrioritiesFilterChange = option => this.selectValue(option.prioritiesId, 'prioritiesId');
  onSprintsFilterChange = options => this.selectValue(options, 'changedSprint');
  onAuthorFilterChange = option => this.selectValue(option ? option.value : null, 'authorId');
  onTypeFilterChange = options => this.selectValue(options, 'typeId');
  onNameFilterChange = e => this.selectValue(e.target.value, 'name');
  onIsOnlyMineFilterChange = () => {
    this.setState(
      currentState => ({
        isOnlyMine: !currentState.isOnlyMine
      }),
      () => {
        this.setFiltersToUrl('isOnlyMine', this.state.isOnlyMine, this.updateFilterList);
      }
    );
  };

  render() {
    const { lang } = this.props;

    const isVisor = this.props.globalRole === VISOR;
    const isExternal = this.props.globalRole === EXTERNAL_USER;
    const singleSprint = this.state.changedSprint.length === 1 ? this.state.changedSprint[0].value : null;

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
                      onChange={this.onPrioritiesFilterChange}
                      priority={this.state.prioritiesId}
                      priorityTitle={localize[lang].PRIORITY}
                      canEdit
                    />
                  </Col>
                  <Col className={css.filterButtonCol}>
                    <Checkbox
                      checked={this.state.isOnlyMine}
                      onChange={this.onIsOnlyMineFilterChange}
                      label={localize[lang].MY_TASKS}
                    />
                  </Col>
                  <Col xs style={{ minWidth: 200 }}>
                    <SelectDropdown
                      name="filterTags"
                      multi
                      placeholder={localize[lang].TAG_NAME}
                      backspaceToRemoveMessage=""
                      onChange={this.selectTagForFiltrated}
                      noResultsText="Нет результатов"
                      {...this.getFilterTagsProps()}
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
                      onChange={this.onNameFilterChange}
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
                      onChange={this.onTypeFilterChange}
                    />
                  </Col>
                </Row>
                <Row className={css.filtersRow}>
                  <Col xs={12} sm={6} className={css.changedSprint}>
                    <SprintSelector
                      name="changedSprint"
                      placeholder={localize[lang].SELECT_SPRINT}
                      multi
                      backspaceToRemoveMessage=""
                      value={this.state.changedSprint.map(sprint => sprint.value)}
                      onChange={this.onSprintsFilterChange}
                      noResultsText={localize[lang].NO_RESULTS}
                      options={this.props.sortedSprints}
                    />
                    <div className={css.sprintTimeWrapper}>
                      {!isExternal
                        ? this.getSprintTime(this.state.changedSprint).map((time, key) => (
                            <span key={key} className={css.sprintTime}>
                              {time}
                            </span>
                          ))
                        : null}
                    </div>
                  </Col>
                  <Col xs>
                    <SelectDropdown
                      name="author"
                      placeholder={localize[lang].SELECT_AUTHOR}
                      multi={false}
                      value={this.state.authorId}
                      onChange={this.onAuthorFilterChange}
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
                  filters={this.state.allFilters}
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
            selectedSprintValue={singleSprint}
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
  authorOptions: PropTypes.array,
  changeTask: PropTypes.func.isRequired,
  currentSprint: PropTypes.array,
  getProjectInfo: PropTypes.func,
  getProjectUsers: PropTypes.func,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  lang: PropTypes.string,
  lastCreatedTask: PropTypes.object,
  lastUpdatedTask: PropTypes.object,
  location: PropTypes.object,
  myTaskBoard: PropTypes.bool,
  myTasks: PropTypes.object,
  noTagData: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number
  }),
  openCreateTaskModal: PropTypes.func.isRequired,
  params: PropTypes.object,
  project: PropTypes.object,
  sortedSprints: PropTypes.array,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array,
  startTaskEditing: PropTypes.func,
  statuses: PropTypes.array,
  tags: PropTypes.array,
  taskTypes: PropTypes.array,
  tasks: PropTypes.object,
  tracksChange: PropTypes.number,
  typeOptions: PropTypes.array,
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
  noTagData: getNoTagData(state),
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
  statuses: getLocalizedTaskStatuses(state),
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  getProjectUsers,
  getProjectInfo,
  getProjectTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgileBoard);
