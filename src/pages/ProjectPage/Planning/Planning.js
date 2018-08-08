import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Planning.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';

import { editSprint } from '../../../actions/Sprint';
import { createSprint } from '../../../actions/Sprint';
import { editMilestone, deleteMilestone } from '../../../actions/Milestone';
import getPlanningTasks from '../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { changeTasks } from '../../../actions/Tasks';
import { openCreateTaskModal, getProjectInfo, changeProject } from '../../../actions/Project';

import Button from '../../../components/Button';
import RoundButton from '../../../components/RoundButton';
import SimplePie from '../../../components/SimplePie';
import Budget from '../../../components/PlanningEdit/Budget';
import ConfirmModal from '../../../components/ConfirmModal';
import CreateTaskModal from '../../../components/CreateTaskModal';
import ProjectDate from '../../../components/PlanningEdit/ProjectDate';
import SprintCard from '../../../components/SprintCard';
import SprintEditModal from '../../../components/SprintEditModal';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';

import { BACKLOG_ID } from '../../../constants/Sprint';
import { ADMIN, VISOR, EXTERNAL_USER } from '../../../constants/Roles';
import { DONE } from '../../../constants/TaskStatuses';

import CreateSprintModal from '../CreateSprintModal';
import CreateMilestoneModal from './CreateMilestoneModal';
import DraggableTaskRow from './DraggableTaskRow';
import EditMilestoneModal from './EditMilestoneModal';
import SprintColumnHeader from './SprintColumnHeader/';
import SprintColumn from './SprintColumn';
import Table from './Table';
import localize from './Planning.json';

import moment from 'moment';
import _ from 'lodash';

class Planning extends Component {
  static propTypes = {
    SprintIsEditing: PropTypes.bool,
    changeProject: PropTypes.func,
    changeTask: PropTypes.func.isRequired,
    changeTasks: PropTypes.func.isRequired,
    completedAt: PropTypes.string,
    createSprint: PropTypes.func.isRequired,
    createdAt: PropTypes.string,
    editSprint: PropTypes.func.isRequired,
    getPlanningTasks: PropTypes.func.isRequired,
    getProjectInfo: PropTypes.func.isRequired,
    isCreateTaskModalOpen: PropTypes.bool,
    lastCreatedTask: PropTypes.object,
    leftColumnTasks: PropTypes.object,
    loading: PropTypes.number,
    milestones: PropTypes.array,
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
    if (!nextProps.SprintIsEditing && this.props.SprintIsEditing) {
      this.selectValue(this.state.leftColumn, 'leftColumn');
      this.selectValue(this.state.rightColumn, 'rightColumn');
    }

    if (this.props.project.sprints.length === 0 && nextProps.project.sprints.length > 0) {
      this.selectValue(BACKLOG_ID, 'leftColumn');
      this.selectValue(this.getCurrentSprint(nextProps.project.sprints), 'rightColumn');
    }

    if (this.props.project.sprints !== nextProps.project.sprints) {
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

  handleOpenModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: true });
  };

  handleCloseModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: false });
  };

  handleOpenModalAddMilestone = () => {
    this.setState({ isModalOpenAddMilestone: true });
  };

  handleCloseModalAddMilestone = () => {
    this.setState({ isModalOpenAddMilestone: false });
  };

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
    let sprints = this.props.project.sprints;

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
      return {
        summary: `${localize[this.props.lang].TOTAL_TIME} ${sprintSpentTime} ${
          sprintEstimate ? localize[this.props.lang].OF + sprintEstimate : ''
        } ${localize[this.props.lang].H}`,
        width: `${width(ratio)}%`,
        active: sprintEstimate !== 0,
        exceeded: ratio > 1
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

  onMouseOverRow = (type, id) => {
    return () => {
      this.setState({ typeHovered: type, typeIdHovered: id });
    };
  };

  onMouseOutRow = () => {
    this.setState({ typeHovered: null, idHovered: null });
  };

  onClickSprint = sprintId => {
    return () => {
      this.selectValue(sprintId, 'rightColumn');
    };
  };

  grantYearIncrement = () => {
    this.setState({ grantActiveYear: ++this.state.grantActiveYear });
  };

  grantYearDecrement = () => {
    this.setState({ grantActiveYear: --this.state.grantActiveYear });
  };

  openSprintEditModal = sprint => {
    return () => {
      this.setState({
        editSprint: sprint,
        isOpenSprintEditModal: true
      });
    };
  };

  openMilestoneEditModal = milestone => {
    return () => {
      this.setState({
        editMilestone: milestone,
        isOpenMilestoneEditModal: true
      });
    };
  };

  onDeleteMilestone = milestone => () => this.props.deleteMilestone(milestone.id);

  handleEditSprint = sprint => {
    this.setState({ isOpenSprintEditModal: false });
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
      sprint.budget,
      sprint.riskBudget,
      sprint.qaPercent
    );
  };

  closeEditSprintModal = () => {
    this.setState({
      editSprint: null,
      isOpenSprintEditModal: false
    });
  };

  closeEditMilestoneModal = () => {
    this.setState({
      editMilestone: null,
      isOpenMilestoneEditModal: false
    });
  };

  checkIsAdminInProject = () => {
    // if (this.props.user.globalRole === EXTERNAL_USER) {
    //   return false;
    // }
    return (
      this.props.user.projectsRoles.admin.indexOf(this.props.project.id) !== -1 || this.props.user.globalRole === ADMIN
    );
  };

  sortEntities = (entity1, entity2) => {
    const startDay1 = entity1.factStartDate || entity1.date;
    const startDay2 = entity2.factStartDate || entity2.date;

    return new Date(startDay1) - new Date(startDay2);
  };

  onProjectStartSubmit = createdAt => {
    this.props.changeProject(
      {
        id: this.props.project.id,
        createdAt
      },
      'createdAt'
    );
  };

  onProjectEndSubmit = completedAt => {
    this.props.changeProject(
      {
        id: this.props.project.id,
        completedAt
      },
      'completedAt'
    );
  };

  onBudgetSubmit = budget => {
    this.props.changeProject(
      {
        id: this.props.project.id,
        budget
      },
      'budget'
    );
  };

  onRiskBudgetSubmit = riskBudget => {
    this.props.changeProject(
      {
        id: this.props.project.id,
        riskBudget
      },
      'riskBudget'
    );
  };

  onPercentQaSubmit = qaPercent => {
    this.props.changeProject(
      {
        id: this.props.project.id,
        qaPercent: qaPercent
      },
      'qaPercent'
    );
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

  isMoveTasksButtonDisabled = unfinishedLeftTasksCount => {
    const { leftColumn, rightColumn } = this.state;
    const { loading } = this.props;

    return (
      leftColumn === null ||
      rightColumn === null ||
      leftColumn === rightColumn ||
      unfinishedLeftTasksCount === 0 ||
      loading
    );
  };

  render() {
    const { lang } = this.props;
    const isProjectAdmin = this.checkIsAdminInProject();
    const isVisor = this.props.user.globalRole === VISOR;
    const isExternal = this.props.user.globalRole === EXTERNAL_USER;

    const leftColumnTasksData = this.props.leftColumnTasks.data.map(task => {
      return (
        <DraggableTaskRow
          draggable
          key={`task-${task.id}`}
          task={task}
          prefix={this.props.project.prefix}
          shortcut
          card
        />
      );
    });

    const rightColumnTasksData = this.props.rightColumnTasks.data.map(task => {
      return (
        <DraggableTaskRow
          draggable
          key={`task-${task.id}`}
          task={task}
          prefix={this.props.project.prefix}
          shortcut
          card
        />
      );
    });

    const leftEstimates = this.getEstimatesInfo(this.state.leftColumn);
    const rightEstimates = this.getEstimatesInfo(this.state.rightColumn);
    const leftColumnSprints = this.getSprints();
    const rightColumnSprints = this.getSprints();
    const filteredSprints = this.props.sprints.filter(sprint => {
      return (
        +moment(sprint.factFinishDate).format('YYYY') === this.state.grantActiveYear ||
        +moment(sprint.factStartDate).format('YYYY') === this.state.grantActiveYear
      );
    });

    const filteredMilestones = this.props.milestones.filter(milestone => {
      return +moment(milestone.date).format('YYYY') === this.state.grantActiveYear;
    });

    const entities = filteredSprints.concat(filteredMilestones).sort(this.sortEntities);

    const budget = this.props.project.budget;
    const riskBudget = this.props.project.riskBudget;
    const qaPercent = this.props.project.qaPercent || 30;
    const { createdAt, completedAt, loading } = this.props;
    const unfinishedLeftTasksCount = this.getUnfinishedLeftTasks().length;

    return (
      <div>
        <section>
          <div className={css.dates}>
            <ProjectDate
              onEditSubmit={this.onProjectStartSubmit}
              header={localize[lang].PROJECT_START}
              value={createdAt}
              isProjectAdmin={isProjectAdmin}
              disabledDataRanges={[{ after: new Date(completedAt) }]}
            />
            <hr />
            <ProjectDate
              onEditSubmit={this.onProjectEndSubmit}
              header={localize[lang].PROJECT_END}
              value={completedAt}
              isProjectAdmin={isProjectAdmin}
              disabledDataRanges={[{ before: new Date(createdAt) }]}
            />
          </div>
          <div className={css.budgetContainer}>
            {!!budget && !!riskBudget && <SimplePie value={1 - budget / riskBudget} />}
            <div className={css.legendContainer}>
              {!isExternal ? (
                <div className={css.budgetLegend}>
                  <div style={{ lineHeight: '1.5rem', fontWeight: 'bold' }}>{localize[lang].BUDGET}</div>
                  <Budget
                    onEditSubmit={this.onRiskBudgetSubmit}
                    header={localize[lang].WITH_RISK_RESERVE}
                    value={riskBudget}
                    isProjectAdmin={isProjectAdmin}
                    min={budget}
                  />
                  <Budget
                    onEditSubmit={this.onBudgetSubmit}
                    header={localize[lang].WO_RISK_RESERVE}
                    value={budget}
                    isProjectAdmin={isProjectAdmin}
                    max={riskBudget}
                  />
                  {!!budget && !!riskBudget && <div className={css.riskMarker}>{localize[lang].RISK_RESERVE}</div>}
                </div>
              ) : null}
              {!isExternal ? (
                <div className={css.budgetLegend}>
                  <div style={{ lineHeight: '1.5rem', fontWeight: 'bold' }}>QA:</div>
                  <Budget
                    onEditSubmit={this.onPercentQaSubmit}
                    header={localize[lang].PERCENT_TEST}
                    value={qaPercent}
                    isProjectAdmin={isProjectAdmin}
                    min={0}
                    max={100}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <hr />
          {isProjectAdmin ? (
            <Button
              text={localize[lang].SPRINT}
              type="primary"
              style={{ float: 'right', marginTop: '-.2rem' }}
              icon="IconPlus"
              onClick={this.handleOpenModalAddSprint}
            />
          ) : null}
          {isProjectAdmin ? (
            <Button
              text={localize[lang].MILESTONE}
              type="primary"
              style={{ float: 'right', marginTop: '-.2rem', marginRight: '5px' }}
              icon="IconPlus"
              onClick={this.handleOpenModalAddMilestone}
            />
          ) : null}
          <div className={css.sprintList}>
            {this.props.sprints ? (
              <div>
                <h2
                  className={css.name}
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      isOpenSprintList: !this.state.isOpenSprintList
                    })
                  }
                >
                  {this.state.isOpenSprintList ? <IconArrowDown /> : <IconArrowRight />}
                  {localize[lang].SPRINTS_AND_PHASES}
                </h2>
                {this.state.isOpenSprintList ? (
                  <Row>
                    {this.props.sprints.map((element, i) => (
                      <Col xs={12} sm={6} md={3} key={`sprint-${i}`}>
                        <SprintCard
                          sprint={element}
                          inFocus={this.state.typeHovered === 'sprint' && element.id === this.state.typeIdHovered}
                          onMouseOver={this.onMouseOverRow('sprint', element.id)}
                          onMouseOut={this.onMouseOutRow}
                          isExternal={isExternal}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : null}
              </div>
            ) : null}
          </div>
          {this.state.isModalOpenAddSprint ? <CreateSprintModal onClose={this.handleCloseModalAddSprint} /> : null}
          {this.state.isModalOpenAddMilestone ? (
            <CreateMilestoneModal onClose={this.handleCloseModalAddMilestone} />
          ) : null}
          <Table
            entities={entities}
            typeIdHovered={this.state.typeIdHovered}
            typeHovered={this.state.typeHovered}
            isProjectAdmin={isProjectAdmin}
            isExternal={isExternal}
            onMouseOverRow={this.onMouseOverRow}
            onMouseOutRow={this.onMouseOutRow}
            grantYearDecrement={this.grantYearDecrement}
            grantYearIncrement={this.grantYearIncrement}
            grantActiveYear={this.state.grantActiveYear}
            onClickSprint={this.onClickSprint}
            openSprintEditModal={this.openSprintEditModal}
            openMilestoneEditModal={this.openMilestoneEditModal}
            onDeleteMilestone={this.onDeleteMilestone}
          />
          {!isVisor && !isExternal ? (
            <div className={css.moveTasksBtnWrapper}>
              <div className={css.leftBranch} />
              <div className={css.moveButton}>
                <RoundButton
                  data-tip={localize[lang].REPLACE_UNCLOSED_TASKS}
                  loading={!!loading}
                  onClick={this.onMoveTasksModalOpen}
                  disabled={this.isMoveTasksButtonDisabled(unfinishedLeftTasksCount)}
                >
                  »
                </RoundButton>
              </div>
              <div className={css.mobeButtonLabel}>{localize[lang].REPLACE_UNCLOSED}</div>
              <div className={css.rightBranch} />
            </div>
          ) : null}
          {!isVisor && !isExternal ? (
            <Row className={css.sprintColumnHeaderWrapper}>
              <SprintColumnHeader
                name="left"
                estimates={leftEstimates}
                sprints={leftColumnSprints}
                selectedSprintValue={this.state.leftColumn}
                onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'leftColumn')}
                onCreateTaskClick={this.openModal}
              />
              <ConfirmModal
                isOpen={this.state.isModalOpenMoveTasks}
                contentLabel="modal"
                onRequestClose={this.onMoveTasksModalCancel}
                onConfirm={() => {
                  this.onMoveTasksModalConfirm(this.state.rightColumn);
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
                selectedSprintValue={this.state.rightColumn}
                onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'rightColumn')}
                onCreateTaskClick={this.openModal}
              />
              <Col xs={12} sm={6}>
                {this.state.leftColumn || this.state.leftColumn === 0 ? (
                  <SprintColumn
                    onDrop={this.dropTask}
                    sprint={this.state.leftColumn}
                    tasks={leftColumnTasksData}
                    pagesCount={this.props.leftColumnTasks.pagesCount}
                    loadTasks={this.loadTasks}
                    name="leftColumn"
                  />
                ) : null}
              </Col>
              <Col className={css.rightColumn} xs={12} sm={6}>
                {this.state.rightColumn || this.state.rightColumn === 0 ? (
                  <SprintColumn
                    onDrop={this.dropTask}
                    sprint={this.state.rightColumn}
                    tasks={rightColumnTasksData}
                    pagesCount={this.props.rightColumnTasks.pagesCount}
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
            selectedSprintValue={
              this.state.createTaskCallee === 'left' ? this.state.leftColumn : this.state.rightColumn
            }
            project={this.props.project}
            column={this.state.createTaskCallee}
          />
        ) : null}
        {this.state.isOpenSprintEditModal ? (
          <SprintEditModal
            project={this.props.project}
            sprint={this.state.editSprint}
            handleEditSprint={this.handleEditSprint}
            handleCloseModal={this.closeEditSprintModal}
          />
        ) : null}
        {this.state.isOpenMilestoneEditModal ? (
          <EditMilestoneModal
            milestone={this.state.editMilestone}
            handleEditMilestone={this.handleEditMilestone}
            onClose={this.closeEditMilestoneModal}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  milestones: state.Project.project.milestones,
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
)(Planning);
