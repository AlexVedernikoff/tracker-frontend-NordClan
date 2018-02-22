import React, {Component} from 'react';
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
import * as css from './AgileBoard.scss';


import getTasks from '../../../actions/Tasks';
import { VISOR } from '../../../constants/Roles';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers } from '../../../actions/Project';

const filterTasks = (array) => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };
  array.forEach((element) => {
    switch (element.statusId) {
    case 1: taskArray.new.push(element);
      break;
    case 2: taskArray.dev.push(element);
      break;
    case 3: taskArray.dev.push(element);
      break;
    case 4: taskArray.codeReview.push(element);
      break;
    case 5: taskArray.codeReview.push(element);
      break;
    case 6: taskArray.qa.push(element);
      break;
    case 7: taskArray.qa.push(element);
      break;
    case 8: taskArray.done.push(element);
      break;
    default: break;
    }
  });
  return taskArray;
};

const sortTasksAndCreateCard = (sortedObject, section, onChangeStatus, onOpenPerformerModal, myTaskBoard) => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };

  for (const key in sortedObject) {
    sortedObject[key].sort((a, b) => {
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
    });
    taskArray[key] = sortedObject[key].map((task) => {
      return <TaskCard
        key={`task-${task.id}`}
        task={task}
        section={section}
        onChangeStatus={onChangeStatus}
        onOpenPerformerModal={onOpenPerformerModal}
        myTaskBoard = {myTaskBoard}
      />;
    });
  }
  return taskArray;
};

const getNewStatus = (oldStatusId, newPhase) => {
  let newStatusId;

  switch (newPhase) {
  case 'New': newStatusId = 1;
    break;
  case 'Dev': newStatusId = 3;
    break;
  case 'Code Review': newStatusId = 5;
    break;
  case 'QA': newStatusId = 7;
    break;
  case 'Done': newStatusId = 8;
    break;
  default: break;
  }

  return newStatusId;
};

const getNewStatusOnClick = (oldStatusId) => {
  let newStatusId;

  if (oldStatusId === 2 || oldStatusId === 4 || oldStatusId === 6) {
    newStatusId = oldStatusId + 1;
  } else if (oldStatusId === 3 || oldStatusId === 5 || oldStatusId === 7) {
    newStatusId = oldStatusId - 1;
  }

  return newStatusId;
};

class AgileBoard extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      performer: null,
      changedTask: null,
      allFilters: [],
      ...this.initialFilters
    };
  }

  initialFilters = {
    isOnlyMine: false,
    changedSprint: null,
    filterTags: [],
    typeId: [],
    name: '',
    authorId: null,
    prioritiesId: null,
    performerId: null
  }

  componentDidMount () {
    if (this.props.myTaskBoard) {
      this.selectValue(this.getChangedSprint(this.props), 'changedSprint');
    } else if (this.props.project.id) {
      this.selectValue(this.getCurrentSprint(this.props.sprints), 'changedSprint');
    }
  }

  componentWillReceiveProps (nextProps) {
    if (
      (this.props.sprints !== nextProps.sprints || this.props.lastCreatedTask !== nextProps.lastCreatedTask)
        && nextProps.project.id
    ) {
      this.selectValue(this.getChangedSprint(nextProps), 'changedSprint');
    }

    if (this.props.project.id !== nextProps.project.id) {
      this.getFiltersFromLocalStorage();
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

  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  getChangedSprint = (props) => {
    let changedSprint = this.getCurrentSprint(props.sprints);

    if (props.lastCreatedTask && Number.isInteger(props.lastCreatedTask.sprintId)) {
      changedSprint = props.lastCreatedTask.sprintId;
    }

    return changedSprint;
  };

  toggleFilterView = (e) => {
    e.preventDefault();
    e.stopPropagation();

    return true;
  }

  toggleMine = () => {
    this.setState((currentState) => ({
      isOnlyMine: !currentState.isOnlyMine
    }), () => {
      this.updateFilterList();
      this.saveFiltersToLocalStorage();
    });
  };

  getFiltersFromLocalStorage = () => {
    if (!this.props.myTaskBoard) {
      const localStorageFilter = this.parseLocalStorageFilters();
      if (this.props.params.projectId !== localStorageFilter.projectId) return;
      this.setState({
        isOnlyMine: localStorageFilter.isOnlyMine,
        changedSprint: localStorageFilter.changedSprint,
        filterTags: localStorageFilter.filterTags,
        typeId: localStorageFilter.typeId,
        name: localStorageFilter.name,
        authorId: localStorageFilter.authorId,
        prioritiesId: localStorageFilter.prioritiesId,
        performerId: localStorageFilter.performerId
      });
    } else {
      this.removeFiltersFromLocalStorage();
    }
  }

  parseLocalStorageFilters = () => {
    try {
      return JSON.parse(localStorage.getItem('agileBoardFilters'));
    } catch (e) {
      return {};
    }
  }

  saveFiltersToLocalStorage = () => {
    localStorage.setItem('agileBoardFilters', JSON.stringify({
      projectId: this.props.params.projectId,
      changedSprint: this.state.changedSprint,
      isOnlyMine: this.state.isOnlyMine,
      prioritiesId: this.state.prioritiesId,
      authorId: this.state.authorId,
      typeId: this.state.typeId,
      name: this.state.name,
      filterTags: this.state.filterTags,
      performerId: this.state.performerId
    }));
  }

  removeFiltersFromLocalStorage = () => {
    localStorage.removeItem('agileBoardFilters');
  }

  selectValue = (e, name) => {
    this.setState({[name]: e}, () => {
      if (this.props.myTaskBoard) return this.props.getTasks({performerId: this.props.user.id});
      this.getTasks();
    });
  };

  getTasks = (customOption) => {
    const tags = this.state.filterTags.map((tag) => tag.value);
    const typeId = this.state.typeId.map(option => option.value);
    let options = {
      projectId: this.props.params.projectId,
      sprintId: this.state.changedSprint,
      prioritiesId: this.state.prioritiesId,
      authorId: this.state.authorId,
      typeId: typeId,
      name: this.state.name,
      tags: tags.join(','),
      performerId: this.state.performerId
    };
    if (customOption) options = customOption;
    this.props.getTasks(options);
    this.saveFiltersToLocalStorage();
    this.updateFilterList();
  }

  selectTagForFiltrated = (options) => {
    this.selectValue(options, 'filterTags');
  };

  dropTask = (task, phase) => {
    if (!(phase === 'New' || phase === 'Done')) {
      const taskProps = this.props.sprintTasks.find((sprintTask) => {
        return task.id === sprintTask.id;
      });
      const performerId = taskProps.performerId || null;
      const projectId = taskProps.projectId || null;
      this.openPerformerModal(task.id, performerId, projectId, task.statusId, phase);
    } else {
      this.changeStatus(task.id, task.statusId, phase);
    }
  };

  changeStatus = (taskId, statusId, phase) => {
    this.props.changeTask({
      id: taskId,
      statusId: phase ? getNewStatus(statusId, phase) : getNewStatusOnClick(statusId)
    }, 'Status');

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

  changePerformer = (performerId) => {
    this.props.changeTask({
      id: this.state.changedTask,
      performerId: performerId,
      statusId: getNewStatus(this.state.statusId, this.state.phase)
    }, 'User');

    this.props.startTaskEditing('User');
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    }, () => this.changeStatus(this.state.changedTask, this.state.statusId, this.state.phase));
  };

  getCurrentSprint = sprints => {
    const processedSprints = sprints.filter(sprint => {
      return sprint.statusId === 2;
    });

    const currentSprints = processedSprints.filter(sprint => {
      return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
    });

    return currentSprints.length ? currentSprints[0].id : (processedSprints.length ? processedSprints[0].id : 0);
  };

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
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

  getSprintTime = (sprintId) => {
    if (!sprintId) return false;
    let currentSprint = {};
    this.props.sprints.forEach(sprint => {
      if (sprint.id === sprintId) {
        currentSprint = sprint;
      }
    });
    return `${currentSprint.spentTime || 0} / ${currentSprint.allottedTime || 0}`;
  };

  getAllTags = () => {
    let allTags = this.props.sprintTasks.reduce((arr, task) => {
      return arr.concat(task.tags ? task.tags.map((tags) => tags.name) : []);
    }, []);

    allTags = _.uniq(allTags);

    return allTags.map((tag) => ({
      value: tag,
      label: tag
    }));
  };

  getUsers = () => {
    return this.props.project.users.map((user) => ({
      value: user.id,
      label: user.fullNameRu
    }));
  };

  resetFiled = (name) => {
    this.setState(() => ({
      [name]: this.initialFilters[name]
    }), () => {
      this.getTasks();
    });
  };

  removeFromOptionList = (list, id, arrayName) => {
    const newList = list.filter((item) => {
      return item.value !== id;
    });
    this.setState({
      [arrayName]: newList
    }, () => {
      this.getTasks();
    });
  }

  updateFilterList = () => {
    const filters = [
      this.state.isOnlyMine ? {name: 'isOnlyMine', label: 'мои задачи', onDelete: () => this.resetFiled('isOnlyMine') } : null,
      this.state.authorId ? {name: 'authorId', label: `автор: ${this.getSelectOptions(this.props.project.users, this.state.authorId, 'fullNameRu')}`, onDelete: () => this.resetFiled('authorId') } : null,
      this.state.performerId ? {name: 'performerId', label: `исполнитель: ${this.getSelectOptions(this.props.project.users, this.state.performerId, 'fullNameRu')}`, onDelete: () => this.resetFiled('performerId')} : null,
      this.state.changedSprint ? {name: 'sprint', label: this.getSelectOptions((this.getSprints()).map(sprint => ({id: sprint.value, name: sprint.label})), this.state.changedSprint), onDelete: () => this.resetFiled('changedSprint')} : null,
      this.state.name.length > 0 ? {name: ' name', label: this.state.name, onDelete: () => this.resetFiled('name')} : null,
      ...this.getSelectOptions(null, this.state.typeId, null, 'typeId'),
      ...this.getSelectOptions(null, this.state.filterTags, null, 'filterTags')
    ];

    this.setState({
      allFilters: filters.reduce((acc, filter) => {
        if (filter !== null) return [...acc, filter];
        return acc;
      }, [])
    });
  };

  createOptions = (array, labelField = 'name') => {
    return array.map(
      element => ({
        value: element.id,
        label: element[labelField]
      })
    );
  };

  getSelectOptions = (array, id, labelField = 'name', arrayName = 'array', onDelete) => {
    if (Array.isArray(id)) {
      return id.map(currentId => ({name: `${arrayName}-${currentId.value}`, label: currentId.label, onDelete: () => { this.removeFromOptionList(id, currentId.value, arrayName); }}));
    } else {
      const option = array.find(element => element.id === id);
      if (!option) return null;
      return option[labelField];
    }
  };

  clearFilter = () => {
    this.setState({
      ...this.initialFilters
    }, () => {
      this.getTasks({
        projectId: this.props.params.projectId,
        sprintId: null,
        ...this.initialFilters
      });
    });
  }

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
  }

  render () {
    const {
      statuses,
      taskTypes,
      project
    } = this.props;

    let allSorted = filterTasks(this.props.sprintTasks);
    allSorted = sortTasksAndCreateCard(allSorted, 'all', this.changeStatus, this.openPerformerModal);

    const myTasks = this.props.sprintTasks.filter((task) => {
      return task.performer && task.performer.id === this.props.user.id;
    });

    let mineSorted = filterTasks(myTasks);
    mineSorted = sortTasksAndCreateCard(mineSorted, 'mine', this.changeStatus, this.openPerformerModal, this.props.myTaskBoard);

    const isVisor = this.props.globalRole === VISOR;

    const statusOptions = this.createOptions(statuses);
    const typeOptions = this.createOptions(taskTypes);
    const authorOptions = this.createOptions(project.users, 'fullNameRu');

    return (
      <section className={css.agileBoard}>
        {
          !this.props.myTaskBoard
            ? <div>
                <Row className={css.filtersRow}>
                  <Col xs={12} sm={12}>
                    <FilterList filters={this.state.allFilters}/>
                  </Col>
                </Row>
                <Row className={css.filtersRow}>
                  <Col className={css.filterButtonCol}>
                    <Priority
                      onChange={(option) => this.selectValue(option.prioritiesId, 'prioritiesId')}
                      priority={this.state.prioritiesId}
                      canEdit
                    />
                  </Col>
                  <Col className={css.filterButtonCol}>
                    <Checkbox
                      checked={this.state.isOnlyMine}
                      onChange={this.toggleMine}
                      label="Только мои задачи"
                    />
                  </Col>
                  <Col xs style={{minWidth: 200}}>
                    <SelectDropdown
                      name="filterTags"
                      multi
                      placeholder="Введите название тега"
                      backspaceToRemoveMessage=""
                      value={this.state.filterTags}
                      onChange={this.selectTagForFiltrated}
                      noResultsText="Нет результатов"
                      options={this.getAllTags()}
                    />
                  </Col>
                {
                  !isVisor
                    ? <Col className={css.filterButtonCol}>
                        <Button
                          onClick={this.props.openCreateTaskModal}
                          type="primary"
                          text="Создать задачу"
                          icon="IconPlus"
                          name="right"
                        />
                      </Col>
                    : null
                }
              </Row>
              <Row className={css.filtersRow}>
                <Col xs={12} sm={6}>
                  <Input
                    placeholder="Введите название задачи"
                    value={this.state.name}
                    onChange={(e) => this.selectValue(e.target.value, 'name')}
                  />
                </Col>
                <Col xs={12} sm={3}>
                  <PerformerFilter
                    onPerformerSelect={(option) => this.selectValue(option ? option.value : null, 'performerId')}
                    selectedPerformerId={this.state.performerId}
                  />
                </Col>
                <Col xs={12} sm={3}>
                  <SelectDropdown
                    name="type"
                    placeholder="Выберите тип задачи"
                    multi
                    noResultsText="Нет подходящих типов"
                    backspaceToRemoveMessage={''}
                    clearAllText="Очистить все"
                    value={this.state.typeId}
                    options={typeOptions}
                    onChange={(options) => this.selectValue(options, 'typeId')}
                  />
                </Col>
              </Row>
              <Row className={css.filtersRow}>
                <Col xs={12} sm={6} className={css.changedSprint}>
                  <SelectDropdown
                    name="changedSprint"
                    placeholder="Выберите спринт"
                    multi={false}
                    value={this.state.changedSprint}
                    onChange={(e) => this.selectValue(e !== null ? e.value : null, 'changedSprint')}
                    noResultsText="Нет результатов"
                    options={this.getSprints()}
                  />
                  <span className={css.sprintTime}>
                    {this.getSprintTime(this.state.changedSprint) || null}
                  </span>
                </Col>
                <Col xs>
                  <SelectDropdown
                    name="author"
                    placeholder="Выберите автора задачи"
                    multi={false}
                    value={this.state.authorId}
                    onChange={(option) => this.selectValue(option ? option.value : null, 'authorId')}
                    noResultsText="Нет результатов"
                    options={authorOptions}
                  />
                </Col>
                <Col className={css.filterButtonCol}>
                  <Button
                    onClick={this.clearFilter}
                    type="primary"
                    text="Очистить фильтры"
                    icon="IconClose"
                    name="right"
                    disabled={this.isFilterEmpty()}
                  />
                </Col>
            </Row>
            </div>
            : null
        }

        <div className={css.boardContainer}>
          {
            this.props.myTaskBoard || this.state.isOnlyMine
              ? <Row>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'New'} tasks={mineSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Dev'} tasks={mineSorted.dev}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Code Review'} tasks={mineSorted.codeReview}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'QA'} tasks={mineSorted.qa}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Done'} tasks={mineSorted.done}/>
              </Row>
              : <Row>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'New'} tasks={allSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Dev'} tasks={allSorted.dev} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Code Review'} tasks={allSorted.codeReview} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'QA'} tasks={allSorted.qa} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Done'} tasks={allSorted.done} />
              </Row>
          }
        </div>

        {
          this.state.isModalOpen
            ? <PerformerModal
              defaultUser={this.state.performer}
              onChoose={this.changePerformer}
              onClose={this.closeModal}
              title="Изменить исполнителя задачи"
              users={this.getUsers()}
            />
            : null
        }
        {
          this.props.isCreateTaskModalOpen
            ? <CreateTaskModal
              selectedSprintValue={this.state.changedSprint}
              project={this.props.project}
            />
            : null
        }
      </section>
    );
  }
}

AgileBoard.propTypes = {
  StatusIsEditing: PropTypes.bool,
  UserIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  lastCreatedTask: PropTypes.object,
  myTaskBoard: PropTypes.bool,
  openCreateTaskModal: PropTypes.func.isRequired,
  params: PropTypes.object,
  project: PropTypes.object,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array,
  startTaskEditing: PropTypes.func,
  user: PropTypes.object,
  getProjectUsers: PropTypes.func,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  lastCreatedTask: state.Project.lastCreatedTask,
  sprintTasks: state.Tasks.tasks,
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  StatusIsEditing: state.Task.StatusIsEditing,
  UserIsEditing: state.Task.UserIsEditing,
  user: state.Auth.user,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  globalRole: state.Auth.user.globalRole,
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes
});

const mapDispatchToProps = {
  getTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  getProjectUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(AgileBoard);
