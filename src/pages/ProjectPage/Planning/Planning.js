import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Planning.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import DraggableTaskRow from './DraggableTaskRow';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import CreateTaskModal from '../../../components/CreateTaskModal';
import SprintColumn from './SprintColumn';
import { connect } from 'react-redux';
import moment from 'moment';
import Budget from '../../../components/PlanningEdit/Budget';
import ProjectDate from '../../../components/PlanningEdit/ProjectDate';
import { createSprint } from '../../../actions/Sprint';
import CreateSprintModal from '../CreateSprintModal';
import SprintCard from '../../../components/SprintCard';
import getPlanningTasks from '../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { editSprint } from '../../../actions/Sprint';
import { editMilestone } from '../../../actions/Milestone';
import { openCreateTaskModal, getProjectInfo, changeProject } from '../../../actions/Project';
import SprintEditModal from '../../../components/SprintEditModal';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';
import { IconEdit } from '../../../components/Icons';
import { BACKLOG_ID } from '../../../constants/Sprint';
import { ADMIN, VISOR } from '../../../constants/Roles';
import Table from './Table';
import CreateMilestoneModal from './CreateMilestoneModal';
import EditMilestoneModal from './EditMilestoneModal';
import SprintColumnHeader from './SprintColumnHeader/';

class Planning extends Component {
  static propTypes = {
    SprintIsEditing: PropTypes.bool,
    changeTask: PropTypes.func.isRequired,
    createSprint: PropTypes.func.isRequired,
    changeProject: PropTypes.func,
    editSprint: PropTypes.func.isRequired,
    getProjectInfo: PropTypes.func.isRequired,
    getPlanningTasks: PropTypes.func.isRequired,
    isCreateTaskModalOpen: PropTypes.bool,
    lastCreatedTask: PropTypes.object,
    leftColumnTasks: PropTypes.object,
    createdAt: PropTypes.string,
    completedAt: PropTypes.string,
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
      const sprintEstimate = sprint && sprint.allottedTime ? +sprint.allottedTime : 0;
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
        summary: `Суммарное время: ${sprintSpentTime} ${sprintEstimate ? ' из ' + sprintEstimate : ''} ч.`,
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

  handleEditSprint = sprint => {
    this.setState({ isOpenSprintEditModal: false });
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
      sprint.allottedTime,
      sprint.budget,
      sprint.riskBudget
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

  loadTasks = (e, name, activePage) => {
    this.props.getPlanningTasks(name === 'leftColumn' ? 'left' : 'right', {
      projectId: this.props.project.id,
      sprintId: this.state[name],
      currentPage: activePage
    });
  };

  render() {
    const isProjectAdmin = this.checkIsAdminInProject();
    const isVisor = this.props.user.globalRole === VISOR;

    const leftColumnTasksData = this.props.leftColumnTasks.data.map(task => {
      return <DraggableTaskRow key={`task-${task.id}`} task={task} prefix={this.props.project.prefix} shortcut card />;
    });

    const rightColumnTasksData = this.props.rightColumnTasks.data.map(task => {
      return <DraggableTaskRow key={`task-${task.id}`} task={task} prefix={this.props.project.prefix} shortcut card />;
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

    const { createdAt, completedAt } = this.props;
    return (
      <div>
        <section>
          <br />
          <Row className={css.editRow}>
            <Col xs={12} sm={5}>
              <ProjectDate
                onEditSubmit={this.onProjectStartSubmit}
                header="Начало проекта:"
                value={createdAt}
                isProjectAdmin={isProjectAdmin}
                disabledDataRanges={[{ after: new Date(completedAt) }]}
              />
            </Col>
            <Col xs={12} sm={2} />
            <Col xs={12} sm={5}>
              <ProjectDate
                onEditSubmit={this.onProjectEndSubmit}
                header="Конец проекта:"
                value={completedAt}
                isProjectAdmin={isProjectAdmin}
                disabledDataRanges={[{ before: new Date(createdAt) }]}
              />
            </Col>
          </Row>
          <Row className={css.editRow}>
            <Col xs={12} sm={5}>
              <Budget
                onEditSubmit={this.onRiskBudgetSubmit}
                header="Бюджет с рисковым резервом:"
                value={riskBudget}
                isProjectAdmin={isProjectAdmin}
              />
            </Col>
            <Col xs={12} sm={2} />
            <Col xs={12} sm={5}>
              <Budget
                onEditSubmit={this.onBudgetSubmit}
                header="Бюджет без рискового резерва:"
                value={budget}
                isProjectAdmin={isProjectAdmin}
              />
            </Col>
          </Row>
          {isProjectAdmin ? (
            <Button
              text="Создать спринт"
              type="primary"
              style={{ float: 'right', marginTop: '-.2rem' }}
              icon="IconPlus"
              onClick={this.handleOpenModalAddSprint}
            />
          ) : null}
          {isProjectAdmin ? (
            <Button
              text="Создать веху"
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
                  Спринты / Фазы
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
            onMouseOverRow={this.onMouseOverRow}
            onMouseOutRow={this.onMouseOutRow}
            grantYearDecrement={this.grantYearDecrement}
            grantYearIncrement={this.grantYearIncrement}
            grantActiveYear={this.state.grantActiveYear}
            onClickSprint={this.onClickSprint}
            openSprintEditModal={this.openSprintEditModal}
            openMilestoneEditModal={this.openMilestoneEditModal}
          />
          {!isVisor ? (
            <div>
              <div className={css.sprintColumnHeaderWrapper}>
                <SprintColumnHeader
                  name="left"
                  estimates={leftEstimates}
                  sprints={leftColumnSprints}
                  selectedSprintValue={this.state.leftColumn}
                  onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'leftColumn')}
                  onCreateTaskClick={this.openModal}
                />
                <Button
                  addedClassNames={{ [css.moveTasksBtn]: true }}
                  type="bordered"
                  icon={'IconSend'}
                  data-tip="Перенести нереализованные задачи в другой спринт"
                />
                <SprintColumnHeader
                  name="right"
                  estimates={rightEstimates}
                  sprints={rightColumnSprints}
                  selectedSprintValue={this.state.rightColumn}
                  onSprintChange={e => this.selectValue(e !== null ? e.value : null, 'rightColumn')}
                  onCreateTaskClick={this.openModal}
                />
              </div>
              <Row>
                <Col xs={12} sm={6}>
                  {this.state.leftColumn || this.state.leftColumn === 0 ? (
                    <SprintColumn onDrop={this.dropTask} sprint={this.state.leftColumn} tasks={leftColumnTasks} />
                  ) : null}
                </Col>
                <Col xs={12} sm={6}>
                  {this.state.rightColumn || this.state.rightColumn === 0 ? (
                    <SprintColumn onDrop={this.dropTask} sprint={this.state.rightColumn} tasks={rightColumnTasks} />
                  ) : null}
                </Col>
              </Row>
            </div>
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
  rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  SprintIsEditing: state.Task.SprintIsEditing,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  user: state.Auth.user
});

const mapDispatchToProps = {
  changeProject,
  getPlanningTasks,
  editSprint,
  editMilestone,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  createSprint,
  getProjectInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
