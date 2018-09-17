import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
// import { UnmountClosed } from 'react-collapse';

import * as css from './AgileBoard.scss';
import localize from './AgileBoard.json';
import PhaseColumn from './PhaseColumn';
import { getNewStatus, getNewStatusOnClick } from './helpers';
import { sortTasksAndCreateCard } from './TaskList';
import { initialFilters, NO_TAG_VALUE, phaseColumnNameById } from './constants';

// import FilterList from '../../../components/FilterList';
import PerformerModal from '../../../components/PerformerModal';
import AgileBoardFilter from '../../../components/AgileBoardFilter';
// import Input from '../../../components/Input';
// import SelectDropdown from '../../../components/SelectDropdown';
// import Button from '../../../components/Button';
// import Priority from '../../../components/Priority';
// import Checkbox from '../../../components/Checkbox';
import CreateTaskModal from '../../../components/CreateTaskModal';
// import PerformerFilter from '../../../components/PerformerFilter';
// import SprintSelector from '../../../components/SprintSelector';
import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

import { getFullName } from '../../../utils/NameLocalisation';
// import getPriorityById from '../../../utils/TaskPriority';
import { agileBoardSelector } from '../../../selectors/agileBoard';

import { VISOR, EXTERNAL_USER } from '../../../constants/Roles';
import getTasks from '../../../actions/Tasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo, getProjectTags } from '../../../actions/Project';

class AgileBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightedTaskId: null,
      isCardFocus: false,
      isModalOpen: false,
      performer: null,
      changedTask: null
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();
    this.setState({
      ...this.state,
      filters: nextProps.filters
    });
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  getTasks = customOption => {
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
    // this.updateFilterList();
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
  };

  closeModal = performerId => {
    this.setState(
      {
        isModalOpen: false
      },
      () => this.changeStatus(this.state.changedTask, this.state.statusId, this.state.phase, performerId)
    );
  };

  getUsers = () => {
    return this.props.project.users.map(user => ({
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
      this.props.tasks,
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

  get allSortedTasks() {
    return this.getTasksList('all');
  }

  get mineSortedTasks() {
    return this.getTasksList('mine');
  }

  get singleSprint() {
    return this.changedSprint.length === 1 ? this.props.filters.changedSprint[0].value : null;
  }

  render() {
    const { lang } = this.props;

    return (
      <section className={css.agileBoard}>
        <AgileBoardFilter {...this.props} />
        <div className={css.boardContainer}>
          {this.props.myTaskBoard || this.state.isOnlyMine ? (
            <Row>
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'New'} tasks={this.mineSortedTasks.new} />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Dev'} tasks={this.mineSortedTasks.dev} />
              <PhaseColumn
                onDrop={this.dropTask}
                section={'mine'}
                title={'Code Review'}
                tasks={this.mineSortedTasks.codeReview}
              />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'QA'} tasks={this.mineSortedTasks.qa} />
              <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Done'} tasks={this.mineSortedTasks.done} />
            </Row>
          ) : (
            <Row>
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'New'} tasks={this.allSortedTasks.new} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Dev'} tasks={this.allSortedTasks.dev} />
              <PhaseColumn
                onDrop={this.dropTask}
                section={'all'}
                title={'Code Review'}
                tasks={this.allSortedTasks.codeReview}
              />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'QA'} tasks={this.allSortedTasks.qa} />
              <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Done'} tasks={this.allSortedTasks.done} />
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
            selectedSprintValue={this.singleSprint}
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
