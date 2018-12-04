import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { Row } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import * as css from './AgileBoard.scss';
import localize from './AgileBoard.json';
import PhaseColumn from './PhaseColumn';
import { getNewStatus, getNewStatusOnClick } from './helpers';
import { sortTasksAndCreateCard } from './TaskList';
import { initialFilters, phaseColumnNameById } from './constants';

import PerformerModal from '../../../components/PerformerModal';
import AgileBoardFilter from '../../../components/AgileBoardFilter';
import CreateTaskModal from '../../../components/CreateTaskModal';
import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

import { getFullName } from '../../../utils/NameLocalisation';
import { agileBoardSelector } from '../../../selectors/agileBoard';

import { EXTERNAL_USER } from '../../../constants/Roles';
import getTasks from '../../../actions/Tasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo, getProjectTags } from '../../../actions/Project';
import { showNotification } from '../../../actions/Notifications';

import { sortedUsersSelector } from '../../../selectors/Project';

class AgileBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightedTaskId: null,
      isCardFocus: false,
      isModalOpen: false,
      performer: null,
      changedTask: null,
      isOnlyMine: props.filters.isOnlyMine
    };
  }

  componentDidMount() {
    if (this.props.myTaskBoard) this.getTasks();
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();

    if (nextProps.filters.isOnlyMine !== this.state.isOnlyMine) {
      this.setState({
        isOnlyMine: nextProps.filters.isOnlyMine
      });
    }
  }

  componentDidUpdate(prevProps) {
    ReactTooltip.rebuild();
    if (!isEqual(prevProps.filters, this.props.filters)) {
      this.getTasks();
    }
  }

  changeOnlyMineState = isOnlyMine => {
    this.setState({
      isOnlyMine
    });
  };

  getTasks = customOption => {
    const { filters } = this.props;
    const options = customOption
      ? customOption
      : {
          projectId: this.props.params.projectId,
          sprintId: filters.changedSprint || null,
          prioritiesId: filters.prioritiesId,
          authorId: filters.authorId,
          typeId: filters.typeId || null,
          name: filters.name || null,
          tags: filters.filterTags,
          performerId: filters.performerId || null
        };
    this.props.getTasks(options);
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
      statusId: phase ? getNewStatus(phase) : getNewStatusOnClick(statusId)
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
        statusId: getNewStatus(this.state.phase)
      },
      'User'
    );
    this.props.startTaskEditing('User');
    this.setState({
      isModalOpen: false
    });
  };

  closeModal = performerId => {
    this.setState({
      isModalOpen: false
    });
  };

  getUsers = () => {
    const { sortedUsers } = this.props;
    return _.union(
      sortedUsers.devops,
      sortedUsers.pm,
      sortedUsers.teamLead,
      sortedUsers.account,
      sortedUsers.analyst,
      sortedUsers.back,
      sortedUsers.front,
      sortedUsers.ux,
      sortedUsers.mobile,
      sortedUsers.ios,
      sortedUsers.android,
      sortedUsers.qa,
      sortedUsers.other
    ).map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
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
    return this.props.myTaskBoard || this.state.isOnlyMine;
  }
  unionPerformers = [];

  sortPerformersList = users => {
    switch (this.state.statusId) {
      case 2:
        this.unionPerformers = _.union(
          users.pm,
          users.account,
          users.teamLead,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 3:
        this.unionPerformers = _.union(
          users.pm,
          users.account,
          users.teamLead,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 4:
        this.unionPerformers = _.union(
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
      case 5:
        this.unionPerformers = _.union(
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
      case 6:
        this.unionPerformers = users.qa;
        break;
      case 7:
        this.unionPerformers = users.qa;
        break;
      default:
        this.unionPerformers = _.union(
          users.pm,
          users.account,
          users.teamlead,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android,
          users.qa,
          users.devops
        );
    }
  };

  render() {
    const { lang, tags, noTagData, users } = this.props;
    const tasksList = this.isOnlyMine ? this.getMineSortedTasks() : this.getAllSortedTasks();
    const tasksKey = this.isOnlyMine ? 'mine' : 'all';
    const filtersComponent = this.props.myTaskBoard ? null : (
      <AgileBoardFilter
        {...this.props}
        getTasks={this.getTasks}
        initialFilters={initialFilters}
        tags={[noTagData].concat(tags)}
      />
    );
    this.sortPerformersList(users);

    const usersFullNames = this.unionPerformers.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? getFullName(item.user) : getFullName(item)
    }));

    return (
      <section className={css.agileBoard}>
        {filtersComponent}
        <div className={css.boardContainer}>
          <Row>
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title={'New'} tasks={tasksList.new} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title={'Dev'} tasks={tasksList.dev} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title={'Code Review'} tasks={tasksList.codeReview} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title={'QA'} tasks={tasksList.qa} />
            <PhaseColumn onDrop={this.dropTask} section={tasksKey} title={'Done'} tasks={tasksList.done} />
          </Row>
        </div>

        {this.state.isModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closeModal}
            title={localize[lang].CHANGE_PERFORMER}
            users={usersFullNames}
          />
        ) : null}
        {this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal
            selectedSprintValue={this.singleSprint}
            project={this.props.project}
            defaultPerformerId={this.state.performer}
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
  filters: PropTypes.object.isRequired,
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
    value: PropTypes.string
  }),
  openCreateTaskModal: PropTypes.func.isRequired,
  params: PropTypes.object,
  project: PropTypes.object,
  sortedSprints: PropTypes.array,
  sortedUsers: PropTypes.object,
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
  ...agileBoardSelector(state),
  sortedUsers: sortedUsersSelector(state)
});

const mapDispatchToProps = {
  getTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  getProjectUsers,
  getProjectInfo,
  getProjectTags,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFiltersManager(AgileBoard, initialFilters));
