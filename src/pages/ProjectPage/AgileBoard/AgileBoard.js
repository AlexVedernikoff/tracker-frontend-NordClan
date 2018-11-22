import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
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
import { getDevOpsUsers } from '../../../actions/Users';
import * as _ from 'lodash';

class AgileBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightedTaskId: null,
      isCardFocus: false,
      isModalOpen: false,
      changedTaskIsDevOps: false,
      performer: null,
      changedTask: null,
      isOnlyMine: props.filters.isOnlyMine
    };
  }

  componentDidMount() {
    if (this.props.myTaskBoard) this.getTasks();
    if (!this.props.devOpsUsers) this.props.getDevOpsUsers();
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
      this.openPerformerModal(task, performerId, projectId, task.statusId, phase);
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

  openPerformerModal = (taskId, performerId, projectId, statusId, phase, isDevOps) => {
    if (this.props.myTaskBoard) {
      this.props.getProjectUsers(projectId);
    }
    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: taskId,
      changedTaskIsDevOps: isDevOps,
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
    this.closeModal();
  };

  closeModal = performerId => {
    this.setState(
      {
        isModalOpen: false
      },
      () => this.changeStatus(this.state.changedTask, this.state.statusId, this.state.phase, performerId)
    );
  };

  getUsers = (withDevOps = false) => {
    return withDevOps && this.props.devOpsUsers
      ? _.uniqWith(this.props.project.users.concat(this.props.devOpsUsers), _.isEqual).map(user => ({
          value: user.id,
          label: getFullName(user)
        }))
      : this.props.project.users.map(user => ({
          value: user.id,
          label: getFullName(user)
        }));
  };

  getUsersWithDevOps = () => {
    return this.getUsers(this.state.changedTaskIsDevOps);
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

  render() {
    const { lang, tags, noTagData } = this.props;
    const tasksList = this.isOnlyMine ? this.getMineSortedTasks() : this.getAllSortedTasks();
    const tasksKey = this.isOnlyMine ? 'mine' : 'all';
    const agileFilterProps = {
      ...this.props,
      project: {
        ...this.props.project,
        users: _.uniqWith(this.props.project.users.concat(this.props.devOpsUsers), _.isEqual)
      }
    };
    const filtersComponent = this.props.myTaskBoard ? null : (
      <AgileBoardFilter
        {...agileFilterProps}
        getTasks={this.getTasks}
        initialFilters={initialFilters}
        tags={[noTagData].concat(tags)}
      />
    );

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
            users={this.getUsersWithDevOps()}
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
  getDevOpsUsers,
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
