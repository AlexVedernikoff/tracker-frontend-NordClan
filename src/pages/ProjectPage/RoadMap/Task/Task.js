import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Task.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';

import { editSprint } from '../../../../actions/Sprint';
import { createSprint } from '../../../../actions/Sprint';
import { editMilestone, deleteMilestone } from '../../../../actions/Milestone';
import getPlanningTasks from '../../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../../actions/Task';
import { changeTasks } from '../../../../actions/Tasks';
import { openCreateTaskModal, getProjectInfo, changeProject } from '../../../../actions/Project';

import ConfirmModal from '../../../../components/ConfirmModal';
import CreateTaskModal from '../../../../components/CreateTaskModal';
import { BACKLOG_ID } from '../../../../constants/Sprint';
import { VISOR, EXTERNAL_USER } from '../../../../constants/Roles';
import { DONE } from '../../../../constants/TaskStatuses';

import DraggableTaskRow from './DraggableTaskRow';
import SprintColumnHeader from './SprintColumnHeader';
import SprintColumn from './SprintColumn';
import localize from './Task.json';

import moment from 'moment';

class Task extends Component {
  static propTypes = {
    SprintIsEditing: PropTypes.bool,
    changeProject: PropTypes.func,
    changeTask: PropTypes.func.isRequired,
    changeTasks: PropTypes.func.isRequired,
    completedAt: PropTypes.string,
    createSprint: PropTypes.func.isRequired,
    createdAt: PropTypes.string,
    deleteMilestone: PropTypes.func,
    editSprint: PropTypes.func.isRequired,
    getPlanningTasks: PropTypes.func.isRequired,
    getProjectInfo: PropTypes.func.isRequired,
    isCreateTaskModalOpen: PropTypes.bool,
    lang: PropTypes.string.isRequired,
    lastCreatedTask: PropTypes.object,
    leftColumnTasks: PropTypes.object,
    loading: PropTypes.number,
    openCreateTaskModal: PropTypes.func,
    params: PropTypes.object,
    project: PropTypes.object,
    rightColumnTasks: PropTypes.object,
    sprints: PropTypes.array.isRequired,
    startTaskEditing: PropTypes.func,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpenSprintList: false,
      leftColumn: null,
      rightColumn: null,
      createTaskCallee: null,
      isModalOpenAddSprint: false,
      isModalOpenAddMilestone: false,
      isModalOpenMoveTasks: false,
      typeIdHovered: null,
      typeHovered: null,
      grantActiveYear: new Date().getFullYear(),
      isOpenSprintEditModal: false,
      isOpenMilestoneEditModal: false,
      editSprint: null,
      editMilestone: null
    };
  }

  componentDidMount() {
    this.selectValue(BACKLOG_ID, 'leftColumn');
    this.selectValue(this.getCurrentSprint(this.props.project.sprints), 'rightColumn');
  }

  componentWillReceiveProps(nextProps) {
    const { project, SprintIsEditing } = this.props;
    if (!nextProps.SprintIsEditing && SprintIsEditing) {
      this.selectValue(this.state.leftColumn, 'leftColumn');
      this.selectValue(this.state.rightColumn, 'rightColumn');
    }

    if (project.sprints.length === 0 && nextProps.project.sprints.length > 0) {
      this.selectValue(BACKLOG_ID, 'leftColumn');
      this.selectValue(this.getCurrentSprint(nextProps.project.sprints), 'rightColumn');
    }

    if (project.sprints !== nextProps.project.sprints) {
      if (nextProps.lastCreatedTask && Number.isInteger(nextProps.lastCreatedTask.sprintId)) {
        if (this.state.createTaskCallee === 'left') {
          this.selectValue(nextProps.lastCreatedTask.sprintId, 'leftColumn');
        } else {
          this.selectValue(nextProps.lastCreatedTask.sprintId, 'rightColumn');
        }
      }
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  getCurrentSprint = sprints => {
    const currentSprints = sprints.filter(
      sprint =>
        sprint.statusId === 2 &&
        moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]')
    );

    if (currentSprints.length) {
      return currentSprints[0].id;
    } else {
      return sprints.length
        ? sprints.sort(
            (a, b) => moment(a.factStartDate).diff(moment(), 'days') - moment(b.factStartDate).diff(moment(), 'days')
          )[0].id
        : 0;
    }
  };

  getSprints = () => {
    let { sprints } = this.props.project;

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

  getEstimatesInfo = sprintId => {
    const { lang } = this.props;
    if (!sprintId) {
      return {
        summary: '',
        active: false,
        exceeded: false,
        width: '0%'
      };
    } else {
      const sprint = this.props.project.sprints.filter(item => item.id === sprintId)[0];
      const sprintEstimate = sprint && sprint.riskBudget ? +sprint.riskBudget : 0;
      const sprintSpentTime = sprint && sprint.spentTime ? +sprint.spentTime : 0;
      const ratio = sprintEstimate === 0 ? 0 : sprintSpentTime / sprintEstimate;
      const width = ratioValue => {
        if (ratioValue > 1) {
          return 100;
        } else if (ratioValue < 0) {
          return 0;
        } else {
          return ratioValue * 100;
        }
      };
      const totalPlannedTime = sprint.totalPlannedTime;
      const totalWidth = totalPlannedTime + sprintEstimate;
      return {
        summary: `${localize[lang].TOTAL_TIME} ${sprintSpentTime} ${
          sprintEstimate ? `${localize[lang].OF} ${sprintEstimate}` : ''
        } (${+totalPlannedTime || 0}) ${localize[lang].H}`,
        sprintSpentTime: width(ratio),
        sprintEstimate,
        active: sprintEstimate !== 0,
        exceeded: ratio > 1,
        sprintSpentTimeWidth: width(ratio),
        sprintEstimateWidth: (sprintEstimate * 100) / totalWidth,
        totalPlannedTimeWidth: (totalPlannedTime * 100) / totalWidth
      };
    }
  };

  dropTask = (task, sprint) => {
    this.props.changeTask(
      {
        id: task.id,
        sprintId: sprint
      },
      'Sprint',
      () => this.props.getProjectInfo(this.props.params.projectId)
    );

    this.props.startTaskEditing('Sprint');
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e }, () => {
      this.props.getPlanningTasks(name === 'leftColumn' ? 'left' : 'right', {
        projectId: this.props.project.id,
        sprintId: this.state[name]
      });
    });
  };

  openModal = event => {
    this.setState({
      createTaskCallee: event.target.name
    });
    this.props.openCreateTaskModal();
  };

  loadTasks = (e, name, activePage) => {
    this.props.getPlanningTasks(name === 'leftColumn' ? 'left' : 'right', {
      projectId: this.props.project.id,
      sprintId: this.state[name],
      currentPage: activePage
    });
  };

  onMoveTasksModalOpen = () => {
    this.setState({ isModalOpenMoveTasks: true });
  };

  onMoveTasksModalCancel = () => {
    this.setState({ isModalOpenMoveTasks: false });
  };
  onMoveTasksModalConfirm = sprintId => {
    const tasks = this.getUnfinishedLeftTasks();

    const getPlanningTasksAll = () => {
      const { leftColumnTasks, rightColumnTasks, project } = this.props;

      ['left', 'right'].forEach(side => {
        this.props.getPlanningTasks(side, {
          projectId: project.id,
          sprintId: this.state[`${side}Column`],
          currentPage:
            side !== 'left'
              ? rightColumnTasks.currentPage
              : tasks.length === leftColumnTasks.rowsCountOnCurrentPage
                ? Math.max(0, leftColumnTasks.currentPage - 1)
                : leftColumnTasks.currentPage
        });
      });
    };

    this.props.changeTasks(
      {
        sprintId,
        taskIds: tasks.map(task => task.id)
      },
      getPlanningTasksAll
    );

    this.setState({ isModalOpenMoveTasks: false });
  };

  getUnfinishedLeftTasks = () => this.props.leftColumnTasks.data.filter(task => task.statusId !== DONE);

  render() {
    const { lang, rightColumnTasks, leftColumnTasks, project, user } = this.props;
    const { leftColumn, rightColumn, createTaskCallee } = this.state;
    const isVisor = user.globalRole === VISOR;
    const isExternal = user.globalRole === EXTERNAL_USER;

    const leftColumnTasksData = leftColumnTasks.data.map(task => {
      return <DraggableTaskRow draggable key={`task-${task.id}`} task={task} prefix={project.prefix} shortcut card />;
    });

    const rightColumnTasksData = rightColumnTasks.data.map(task => {
      return <DraggableTaskRow draggable key={`task-${task.id}`} task={task} prefix={project.prefix} shortcut card />;
    });

    const leftEstimates = this.getEstimatesInfo(leftColumn);
    const rightEstimates = this.getEstimatesInfo(rightColumn);
    const leftColumnSprints = this.getSprints();
    const rightColumnSprints = this.getSprints();

    const unfinishedLeftTasksCount = this.getUnfinishedLeftTasks().length;

    return (
      <div>
        <section>
          {!isVisor && !isExternal ? (
            <Row className={css.sprintColumnHeaderWrapper}>
              <SprintColumnHeader
                name="left"
                estimates={leftEstimates}
                sprints={leftColumnSprints}
                selectedSprintValue={leftColumn}
                onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'leftColumn')}
                onCreateTaskClick={this.openModal}
              />
              <ConfirmModal
                isOpen={this.state.isModalOpenMoveTasks}
                contentLabel="modal"
                onRequestClose={this.onMoveTasksModalCancel}
                onConfirm={() => {
                  this.onMoveTasksModalConfirm(rightColumn);
                }}
                onCancel={this.onMoveTasksModalCancel}
                text={`${localize[lang].WILL_BE_REPLACE} ${unfinishedLeftTasksCount} ${
                  localize[lang].CONTINUE_REPLACE
                }`}
              />
              <SprintColumnHeader
                className={css.rightColumn}
                name="right"
                estimates={rightEstimates}
                sprints={rightColumnSprints}
                selectedSprintValue={rightColumn}
                onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'rightColumn')}
                onCreateTaskClick={this.openModal}
              />
              <Col xs={12} sm={6}>
                {leftColumn || leftColumn === 0 ? (
                  <SprintColumn
                    onDrop={this.dropTask}
                    sprint={leftColumn}
                    tasks={leftColumnTasksData}
                    pagesCount={leftColumnTasks.pagesCount}
                    loadTasks={this.loadTasks}
                    name="leftColumn"
                  />
                ) : null}
              </Col>
              <Col className={css.rightColumn} xs={12} sm={6}>
                {rightColumn || rightColumn === 0 ? (
                  <SprintColumn
                    onDrop={this.dropTask}
                    sprint={rightColumn}
                    tasks={rightColumnTasksData}
                    pagesCount={rightColumnTasks.pagesCount}
                    loadTasks={this.loadTasks}
                    name="rightColumn"
                  />
                ) : null}
              </Col>
            </Row>
          ) : null}
        </section>
        {this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal
            selectedSprintValue={createTaskCallee === 'left' ? leftColumn : rightColumn}
            project={project}
            column={createTaskCallee}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  lastCreatedTask: state.Project.lastCreatedTask,
  leftColumnTasks: state.PlanningTasks.leftColumnTasks,
  loading: state.Loading.loading,
  rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  SprintIsEditing: state.Task.SprintIsEditing,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  changeProject,
  getPlanningTasks,
  editSprint,
  editMilestone,
  deleteMilestone,
  changeTask,
  changeTasks,
  startTaskEditing,
  openCreateTaskModal,
  createSprint,
  getProjectInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
