import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
// import classnames from 'classnames';
import { connect } from 'react-redux';
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
import { agileBoardSelector } from '../../../selectors/agileBoard';

import getTasks from '../../../actions/Tasks';
import { VISOR, EXTERNAL_USER } from '../../../constants/Roles';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo, getProjectTags } from '../../../actions/Project';
import SprintSelector from '../../../components/SprintSelector';
import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

const NO_TAG_VALUE = -1;

const initialFilters = {
  isOnlyMine: false,
  changedSprint: null,
  filterTags: [],
  typeId: [],
  name: null,
  authorId: null,
  prioritiesId: null,
  performerId: null
};

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
      // TODO: implement fullFilterView
      fullFilterView: false
    };
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentDidMount() {
    this.getTasks();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      filters: nextProps.filters
    });
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
    let changedSprint = this.changedSprint.length ? this.changedSprint : this.props.currentSprint;
    if (!this.props.myTaskBoard) {
      changedSprint =
        this.props.location.query.currentSprint === undefined
          ? this.props.filters.changedSprint || []
          : [{ value: +this.props.location.query.currentSprint }];
    }
    if (props.lastCreatedTask && Number.isInteger(props.lastCreatedTask.sprintId)) {
      changedSprint = [{ value: props.lastCreatedTask.sprintId }];
    }

    return changedSprint;
  };

  toggleFilterView = () => {
    this.setFilterValue('fullFilterView', !this.props.filters.fullFilterView);
  };

  toggleMine = () => {
    this.setFilterValue('isOnlyMine', true);
  };

  getTasks = customOption => {
    console.log(this.props.filters);
    const options = customOption
      ? customOption
      : {
          projectId: this.props.params.projectId,
          sprintId: this.props.filters.changedSprint
            ? this.props.filters.changedSprint.map(singleType => singleType.value)
            : null,
          prioritiesId: this.props.filters.prioritiesId,
          authorId: this.props.filters.authorId,
          typeId: this.props.filters.typeId
            ? Array.isArray(this.state.typeId)
              ? this.props.filters.typeId.map(singleType => singleType.value)
              : this.props.filters.typeId.value
            : null,
          name: this.props.filters.name || null,
          tags: this.props.filters.filterTags.map(({ value }) => value).join(','),
          noTag: this.props.filters.noTag,
          performerId: this.props.filters.performerId
            ? Array.isArray(this.state.performerId)
              ? this.props.filters.performerId.map(singlePerformer => singlePerformer.value)
              : this.props.filters.performerId.value
            : null
        };
    this.props.getTasks(options);
    //this.updateFilterList();
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
    // const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name', 'noTag'];
    const selectedFilters = [];

    const changedSprint = this.changedSprint.map(sprint => {
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

  setFilterValue = (label, options) => {
    console.log('Label', options, label);
    this.props.setFilterValue(label, options, this.getTasks);
  };

  clearFilters = () => {
    this.props.clearFilters(this.getTasks);
  };

  lightTask = (lightedTaskId, isCardFocus) => {
    this.setState({ lightedTaskId, isCardFocus });
  };

  getFilterTagsProps() {
    const {
      tags,
      noTagData,
      filters: { filterTags, noTag }
    } = this.props;
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

  get changedSprint() {
    return this.props.filters.changedSprint || [];
  }

  render() {
    const { lang, filters } = this.props;

    const isVisor = this.props.globalRole === VISOR;
    const isExternal = this.props.globalRole === EXTERNAL_USER;
    const singleSprint = this.changedSprint.length === 1 ? filters.changedSprint[0].value : null;

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
                      onPerformerSelect={options => this.setFilterValue('performerId', options)}
                      selectedPerformerId={this.props.filters.performerId}
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
                      value={this.props.filters.typeId}
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
                      value={this.changedSprint.map(sprint => sprint.value)}
                      onChange={this.onSprintsFilterChange}
                      noResultsText={localize[lang].NO_RESULTS}
                      options={this.props.sortedSprints}
                    />
                    <div className={css.sprintTimeWrapper}>
                      {!isExternal
                        ? this.getSprintTime(this.changedSprint).map((time, key) => (
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
                      onClick={this.clearFilters}
                      type="primary"
                      text={localize[lang].CLEAR_FILTERS}
                      icon="IconBroom"
                      name="right"
                      disabled={!this.props.filtersIsEmpty}
                    />
                  </Col>
                </Row>
              </div>
            </UnmountClosed>
            <Row className={css.filtersRow}>
              <Col xs={12} sm={12}>
                <FilterList
                  clearAll={this.props.clearFilters}
                  fullFilterView={this.state.fullFilterView}
                  toggleFilterView={this.toggleFilterView}
                  filters={[]}
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

const mapStateToProps = state => agileBoardSelector(state);

const mapDispatchToProps = {
  getTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  getProjectUsers,
  getProjectInfo,
  getProjectTags
};

export default withFiltersManager(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AgileBoard),
  initialFilters
);
