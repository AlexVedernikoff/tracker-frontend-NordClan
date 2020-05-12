import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { bool, func, array, object, string, shape, number, exact, oneOf } from 'prop-types';
import { Row } from 'react-flexbox-grid/lib';

import isEqual from 'lodash/isEqual';
import union from 'lodash/union';
import negate from 'lodash/negate';

import * as css from './AgileBoard.scss';
import PhaseColumn from './PhaseColumn';
import { getNewStatus, getNewStatusOnClick } from './helpers';
import { sortTasksAndCreateCard } from './TaskList';
import { phaseColumnNameById } from './constants';

import PerformerModal from '../../../components/PerformerModal';
import CreateTaskModal from '../../../components/CreateTaskModal';

import { getFullName } from '../../../utils/NameLocalisation';
import { alphabeticallyComparatorLang } from '../../../utils/sortPerformer';

import { EXTERNAL_USER } from '../../../constants/Roles';

import { TASK_STATUSES } from '../../../constants/TaskStatuses';

export default class AgileBoard extends Component {
  static propTypes = {
    StatusIsEditing: bool,
    UserIsEditing: bool,
    addActivity: func,
    authorOptions: array,
    changeTask: func.isRequired,
    currentSprint: array,
    filters: object.isRequired,
    getProjectInfo: func,
    getProjectUsers: func,
    getTasks: func.isRequired,
    globalRole: string,
    isCreateTaskModalOpen: bool,
    lang: oneOf(['ru', 'en']).isRequired,
    lastCreatedTask: object,
    lastUpdatedTask: object,
    localizationDictionary: exact({
      PRIORITY: string.isRequired,
      MY_TASKS: string.isRequired,
      TAG_NAME: string.isRequired,
      CREATE_TASK: string.isRequired,
      TASK_NAME: string.isRequired,
      TASK_TYPE: string.isRequired,
      TYPE_IS_MISS: string.isRequired,
      CLEAR_ALL: string.isRequired,
      SELECT_SPRINT: string.isRequired,
      NO_RESULTS: string.isRequired,
      SELECT_AUTHOR: string.isRequired,
      CLEAR_FILTERS: string.isRequired,
      CHANGE_PERFORMER: string.isRequired,
      WITHOUT_TAG: string.isRequired
    }).isRequired,
    location: object,
    myTaskBoard: bool,
    myTasks: object,
    noTagData: shape({
      label: string,
      value: string
    }),
    openCreateTaskModal: func.isRequired,
    params: object,
    project: object,
    sortedSprints: array,
    sortedUsers: object,
    sprintTasks: array,
    sprints: array,
    startTaskEditing: func,
    statuses: array,
    tags: array,
    taskTypes: array,
    tasks: object,
    tracksChange: number,
    typeOptions: array,
    unsortedUsers: array,
    user: object
  };

  constructor(props) {
    super(props);

    this.state = {
      lightedTaskId: null,
      isCardFocus: false,
      isModalOpen: false,
      changedTaskIsDevOps: false,
      performer: null,
      changedTask: null,
      isOnlyMine: props.filters.isOnlyMine,
      fromTaskCore: false,
      isTshAndCommentsHidden: false,
      changedTags: []
    };
  }

  componentDidMount() {
    this.getTasks();
    this.props.getDevOpsUsers();
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();

    if (nextProps.filters.isOnlyMine !== this.state.isOnlyMine) {
      this.setState({ isOnlyMine: nextProps.filters.isOnlyMine });
    }
  }

  componentDidUpdate(prevProps) {
    ReactTooltip.rebuild();

    if (negate(isEqual)(prevProps.filters, this.props.filters)) {
      this.setTagsFromString(this.props.filters.filterTags);
      this.getTasks();
    }
  }

  changeOnlyMineState = isOnlyMine => {
    this.setState({ isOnlyMine });
  };

  getTasks = customOption => {
    const { filters, getTasks } = this.props;

    const options = customOption
      ? customOption
      : {
          prioritiesId: filters.prioritiesId,
          authorId: filters.authorId,
          typeId: filters.typeId || null,
          name: filters.name || null,
          tags: filters.filterTags,
          performerId: filters.performerId || null
        };

    getTasks(options);
  };

  dropTask = (task, phase) => {
    if (phaseColumnNameById[task.statusId] === phase) {
      return;
    }
    if (phase !== 'New') {
      const taskProps = this.props.sprintTasks.find(sprintTask => task.id === sprintTask.id);
      const performerId = taskProps.performerId || null;
      const projectId = taskProps.projectId || null;
      const isTshAndCommentsHidden = task.statusId === TASK_STATUSES.NEW;
      this.openPerformerModal(
        task,
        performerId,
        projectId,
        task.statusId,
        phase,
        undefined,
        taskProps.isDevOps,
        isTshAndCommentsHidden
      );
    } else {
      this.changeStatus(task.id, task.statusId, phase);
    }
  };

  changeStatus = (taskId, statusId, phase, performerId) => {
    const params = {
      id: taskId,
      statusId: phase ? getNewStatus(phase) : getNewStatusOnClick(statusId)
    };

    if (performerId === 0) {
      params.performerId = performerId;
    }

    this.props.changeTask(params, 'Status');
    this.props.startTaskEditing('Status');
  };

  openPerformerModal = (
    task,
    performerId,
    projectId,
    statusId,
    phase,
    fromTaskCore,
    isDevOps,
    isTshAndCommentsHidden
  ) => {
    const { myTaskBoard, getProjectUsers } = this.props;

    if (myTaskBoard) {
      getProjectUsers(projectId);
    }

    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: task,
      changedTaskIsDevOps: isDevOps,
      statusId,
      phase,
      fromTaskCore,
      isTshAndCommentsHidden
    });
  };

  changePerformer = performerId => {
    this.props.changeTask(
      {
        // Hot fix TODO: fix it
        id: this.state.changedTask.id ? this.state.changedTask.id : this.state.changedTask,
        performerId: performerId,
        statusId: getNewStatus(this.state.phase)
      },
      'User'
    );
    this.props.startTaskEditing('User');
    this.setState({ isModalOpen: false });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  lightTask = (lightedTaskId, isCardFocus) => {
    this.setState({ lightedTaskId, isCardFocus });
  };

  get changedSprint() {
    return this.props.filters.changedSprint || [];
  }

  get isExternal() {
    return this.props.globalRole === EXTERNAL_USER;
  }

  getTasksList(type) {
    return sortTasksAndCreateCard(
      this.props[type === 'mine' ? 'myTasks' : 'tasks'],
      type,
      this.changeStatus,
      this.openPerformerModal,
      this.props.myTaskBoard,
      this.isExternal,
      this.lightTask,
      this.state.lightedTaskId,
      this.state.isCardFocus
    );
  }

  getAllSortedTasks() {
    return this.getTasksList('all');
  }

  getMineSortedTasks() {
    return this.getTasksList('mine');
  }

  get singleSprint() {
    return this.changedSprint.length === 1 ? this.props.filters.changedSprint[0].value : null;
  }

  get isOnlyMine() {
    return this.state.isOnlyMine;
  }

  unionPerformers = [];

  sortPerformersList = users => {
    const { lang } = this.props;

    const devOpsUsers = this.state.changedTaskIsDevOps && this.props.devOpsUsers ? this.props.devOpsUsers : [];
    switch (this.state.phase) {
      case 'Dev':
        this.unionPerformers = union(
          devOpsUsers,
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 'Code Review':
        this.unionPerformers = union(
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 'QA':
        this.unionPerformers = union(
          users.pm,
          users.qa,
          this.props.unsortedUsers.sort(alphabeticallyComparatorLang(lang))
        );
        break;
      default:
        this.unionPerformers = union(
          devOpsUsers,
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android,
          users.qa
        );
    }
    this.unionPerformers = union(this.unionPerformers, this.props.unsortedUsers);
  };

  sortPerformersListForTaskCore = users => {
    const { lang } = this.props;

    const devOpsUsers = this.state.changedTaskIsDevOps && this.props.devOpsUsers ? this.props.devOpsUsers : [];
    switch (this.state.statusId) {
      case TASK_STATUSES.DEV_PLAY:
        this.unionPerformers = union(
          devOpsUsers,
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;

      case TASK_STATUSES.DEV_STOP:
        this.unionPerformers = union(
          devOpsUsers,
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;

      case TASK_STATUSES.CODE_REVIEW_PLAY:
        this.unionPerformers = union(
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;

      case TASK_STATUSES.CODE_REVIEW_STOP:
        this.unionPerformers = union(
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;

      case TASK_STATUSES.QA_PLAY:
      case TASK_STATUSES.QA_STOP:
        this.unionPerformers = union(users.qa, this.props.unsortedUsers.sort(alphabeticallyComparatorLang(lang)));
        break;

      default:
        this.unionPerformers = union(
          devOpsUsers,
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android,
          users.qa
        );
    }
    this.unionPerformers = union(this.unionPerformers, this.props.unsortedUsers);
  };

  setFilterValue = (key, value) => {
    if (key === 'filterTags') {
      this.setTagsFromString(value);
    }
    this.props.setFilterValue(key, value);
  };

  setTagsFromString = tags => {
    this.setState({
      changedTags: (tags || []).map(item => ({ label: item, value: item }))
    });
  };

  render() {
    const { localizationDictionary, noTagData, users } = this.props;

    const tasksList = this.isOnlyMine ? this.getMineSortedTasks() : this.getAllSortedTasks();

    const tasksKey = this.isOnlyMine ? 'mine' : 'all';

    if (this.state.fromTaskCore) {
      this.sortPerformersListForTaskCore(users);
    } else {
      this.sortPerformersList(users);
    }

    const usersFullNames = this.unionPerformers.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? getFullName(item.user) : getFullName(item)
    }));

    return (
      <section className={css.agileBoard}>
        <div className={css.boardContainer}>
          <Row>
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title="New" tasks={tasksList.new} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title="Dev" tasks={tasksList.dev} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title="Code Review" tasks={tasksList.codeReview} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title="QA" tasks={tasksList.qa} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title="Done" tasks={tasksList.done} />
          </Row>
        </div>

        {this.state.isModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closeModal}
            title={localizationDictionary.CHANGE_PERFORMER}
            users={usersFullNames}
            id={this.state.changedTask.id}
            isTshAndCommentsHidden={this.state.isTshAndCommentsHidden}
          />
        ) : null}
        {this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal
            afterCreate={this.getTasks}
            selectedSprintValue={this.singleSprint}
            project={this.props.project}
            defaultPerformerId={this.state.performer}
          />
        ) : null}
      </section>
    );
  }
}
