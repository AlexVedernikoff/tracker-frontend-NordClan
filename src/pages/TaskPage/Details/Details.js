import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import TaskPlanningTime from '../TaskPlanningTime';
import PerformerModal from '../../../components/PerformerModal';
import SprintModal from '../../../components/SprintModal';
import TaskTypeModal from '../../../components/TaskTypeModal';
import TaskGoalModal from '../../../components/TaskGoalModal';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { IconEdit } from '../../../components/Icons';
import getTypeById from '../../../utils/TaskTypes';
import { getProjectUsers, getProjectSprints } from '../../../actions/Project';
import { getTask } from '../../../actions/Task';
import { getGoalsBySprint } from '../../../actions/Goals';
import { connect } from 'react-redux';
import * as css from './Details.scss';
import moment from 'moment';
import { getTaskSpent } from '../../../actions/Task';
import transform from 'lodash/transform';
import roundNum from '../../../utils/roundNum';
import classnames from 'classnames';
import localize from './Details.json';
import { getFullName } from '../../../utils/NameLocalisation';
import { TASK_STATUS_CLOSED } from '../../../constants/Task';
import { getLocalizedTaskTypes } from '../../../selectors/dictionaries';

const spentRequestStatus = {
  READY: 0,
  REQUESTED: 1,
  RECEIVED: 2
};

class Details extends Component {
  static propTypes = {
    ExecutionTimeIsEditing: PropTypes.bool,
    PlanningTimeIsEditing: PropTypes.bool,
    canEdit: PropTypes.bool,
    getGoalsBySprint: PropTypes.func.isRequired,
    getProjectSprints: PropTypes.func.isRequired,
    getProjectUsers: PropTypes.func.isRequired,
    getTask: PropTypes.func.isRequired,
    getTaskSpent: PropTypes.func.isRequired,
    goals: PropTypes.array,
    isExternal: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    sprints: PropTypes.array,
    task: PropTypes.object.isRequired,
    taskTypes: PropTypes.array,
    timeSpent: PropTypes.object,
    users: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltipKey: 0,
      isSprintModalOpen: false,
      isPerformerModalOpen: false,
      isTaskTypeModalOpen: false,
      isTaskGoalModalOpen: false,
      spentRequestStatus: spentRequestStatus.READY
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.timeSpent !== this.props.timeSpent &&
      this.state.spentRequestStatus === spentRequestStatus.REQUESTED
    ) {
      this.setState({ spentRequestStatus: spentRequestStatus.RECEIVED, tooltipKey: Math.random() });
    }
    if (nextProps.task.factExecutionTime !== this.props.task.factExecutionTime) {
      this.setState({ spentRequestStatus: spentRequestStatus.READY, tooltipKey: Math.random() });
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  // Действия со спринтами
  openSprintModal = () => {
    this.props.getProjectSprints(this.props.task.project.id);
    this.setState({ isSprintModalOpen: true });
  };

  closeSprintModal = () => {
    this.setState({ isSprintModalOpen: false });
  };

  changeSprint = sprintId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        sprintId: sprintId
      },
      sprintId
    );
    this.closeSprintModal();
  };

  // Действия с исполнителем
  openPerformerModal = () => {
    this.props.getProjectUsers(this.props.task.project.id);
    this.setState({ isPerformerModalOpen: true });
  };

  closePerformerModal = () => {
    this.setState({ isPerformerModalOpen: false });
  };

  changePerformer = performerId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        performerId: performerId
      },
      this.props.task.id
    );
    this.closePerformerModal();
  };

  // Действия с типом задачи
  openTaskTypeModal = () => {
    this.setState({ isTaskTypeModalOpen: true });
  };

  closeTaskTypeModal = () => {
    this.setState({ isTaskTypeModalOpen: false });
  };

  changeTaskType = typeId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        typeId: typeId
      },
      this.props.task.id
    );

    this.closeTaskTypeModal();
  };

  changeIsTaskByClient = () => {
    this.props.onChange(
      {
        id: this.props.task.id,
        isTaskByClient: !this.props.task.isTaskByClient
      },
      null
    );
  };

  // Действия с целью
  openTaskGoalModal = () => {
    this.props.getGoalsBySprint(this.props.task.sprint.id);
    this.setState({ isTaskGoalModalOpen: true });
  };

  closeTaskGoalModal = () => {
    this.setState({ isTaskGoalModalOpen: false });
  };

  changeGoal = goalId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        goalId: goalId
      },
      this.props.task.id
    );
    this.closeTaskGoalModal();
  };

  spentTooltipRender(spents) {
    return transform(
      spents,
      (spentsList, spentTime, status) => {
        spentsList.push(
          <div className={css.timeString} key={status}>
            <span>{status}:</span>
            {spentTime || 0} {localize[this.props.lang].H}.
          </div>
        );
      },
      []
    );
  }

  onTooltipVisibleChange = () => {
    if (this.state.spentRequestStatus === spentRequestStatus.READY) {
      this.setState({
        spentRequestStatus: spentRequestStatus.REQUESTED
      });
      this.props.getTaskSpent(this.props.task.id);
    }
  };

  render() {
    const { task, sprints, taskTypes, timeSpent, isExternal, lang } = this.props;
    const tags = task.tags.map((tag, i) => {
      const tagName = typeof tag === 'object' ? tag.name : tag;
      return <Tag key={i} name={tagName} taggable="task" taggableId={task.id} />;
    });

    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? getFullName(item.user) : getFullName(item)
    }));

    const performerTag = task.performer ? (
      getFullName(task.performer)
    ) : (
      <span className={css.unassigned}>{localize[lang].NOT_SPECIFIED}</span>
    );

    const goals = this.props.goals.map(item => ({
      value: item.id,
      label: item.name
    }));

    const goalTag =
      task.goals && task.goals[0] ? (
        task.goals[0].name
      ) : (
        <span className={css.unassigned}>{localize[lang].NOT_SPECIFIED}</span>
      );

    const executeTimeTooltip =
      this.state.spentRequestStatus === spentRequestStatus.RECEIVED ? (
        <ReactTooltip
          id="time"
          destroyTooltipOnHide
          aria-haspopup="true"
          className="tooltip"
          getContent={() => this.spentTooltipRender(timeSpent)}
        />
      ) : (
        <ReactTooltip
          id="notime"
          destroyTooltipOnHide
          aria-haspopup="true"
          className="tooltip"
          afterShow={this.onTooltipVisibleChange}
          getContent={() => <div> {localize[lang].LOADING} </div>}
        />
      );
    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            {task.project ? (
              <tr>
                <td>{localize[lang].PROJECT}</td>
                <td>
                  <Link className="underline-link" to={`/projects/${this.props.task.project.id}`}>
                    {task.project.name}
                  </Link>
                </td>
              </tr>
            ) : null}
            <tr>
              <td>{localize[lang].TASK_TYPE}</td>
              <td>
                <span onClick={this.openTaskTypeModal} className={css.editableCell}>
                  {getTypeById(task.typeId, taskTypes)}
                  <span className={css.editIcon}>
                    <IconEdit />
                  </span>
                </span>
              </td>
            </tr>
            <tr>
              <td>{localize[lang].FROM_CLIENT}</td>
              <td className={css.byClient}>
                <Checkbox checked={task.isTaskByClient} onChange={this.changeIsTaskByClient} />
              </td>
            </tr>
            <tr>
              <td>{localize[lang].SPRINT}</td>
              <td>
                <span className={css.editableCell} onClick={this.openSprintModal}>
                  {task.sprint ? task.sprint.name : 'Backlog'}
                  <span className={css.editIcon}>
                    <IconEdit />
                  </span>
                </span>
                {/*<Link to={`/projects/${task.projectId}/agile-board`}>*/}
                {/*{task.sprint ? task.sprint.name : 'Backlog'}*/}
                {/*</Link>*/}
              </td>
            </tr>
            <tr>
              <td>{localize[lang].TAGS}</td>
              <td className={css.tags}>
                <Tags taggable="task" taggableId={task.id} create canEdit>
                  {tags}
                </Tags>
              </td>
            </tr>
            {task.author ? (
              <tr>
                <td>{localize[lang].AUTHOR}</td>
                <td>{getFullName(task.author)}</td>
              </tr>
            ) : null}
            <tr>
              <td>{localize[lang].PERFORMER}</td>
              <td>
                {this.props.task.statusId !== TASK_STATUS_CLOSED ? (
                  <span onClick={this.openPerformerModal} className={css.editableCell}>
                    {performerTag}
                    <span className={css.editIcon}>
                      <IconEdit />
                    </span>
                  </span>
                ) : (
                  <span>{performerTag}</span>
                )}
              </td>
            </tr>
            <tr>
              <td>{localize[lang].GOAL}</td>
              <td>
                {this.props.task.statusId !== TASK_STATUS_CLOSED ? (
                  <span onClick={this.openTaskGoalModal} className={css.editableCell}>
                    {goalTag}
                    <span className={css.editIcon}>
                      <IconEdit />
                    </span>
                  </span>
                ) : (
                  <span>{goalTag}</span>
                )}
              </td>
            </tr>
            <tr>
              <td>{localize[lang].DATE_OF_CREATE}</td>
              <td>{moment(this.props.task.createdAt).format('DD.MM.YYYY')}</td>
            </tr>
            {!isExternal
              ? [
                  <tr key="plannedExecutionTime">
                    <td>{localize[lang].PLANNED_TIME}</td>
                    <td>
                      <TaskPlanningTime
                        time={task.plannedExecutionTime ? task.plannedExecutionTime.toString() : '0'}
                        id={task.id}
                        timeIsEditing={this.props.PlanningTimeIsEditing}
                        canEdit={this.props.canEdit}
                        h={localize[lang].H}
                      />
                    </td>
                  </tr>,
                  <tr key="factExecutionTime">
                    <td>{localize[lang].SPENT_TIME}</td>
                    <td>
                      <span
                        data-tip={!!Number(task.factExecutionTime)}
                        data-place="right"
                        data-for={this.state.spentRequestStatus === spentRequestStatus.RECEIVED ? 'time' : 'notime'}
                        key={this.state.tooltipKey}
                        className={classnames({
                          [css.factTime]: true,
                          [css.alert]: +task.factExecutionTime > +task.plannedExecutionTime,
                          [css.success]: +task.factExecutionTime <= +task.plannedExecutionTime
                        })}
                      >
                        {`${task.factExecutionTime ? roundNum(task.factExecutionTime, 2) : 0} ${localize[lang].H}.`}
                      </span>
                      {Number(task.factExecutionTime) ? executeTimeTooltip : null}
                    </td>
                  </tr>
                ]
              : null}
            <tr>
              <td>{localize[lang].SPENT_QA_TIME}</td>
              <td>
                <span
                  className={classnames({
                    [css.factTime]: true,
                    [css.alert]: +task.qaFactExecutionTime > +task.qaPlannedTime,
                    [css.success]: +task.qaFactExecutionTime <= +task.qaPlannedTime
                  })}
                >
                  {task.qaFactExecutionTime ? roundNum(task.qaFactExecutionTime, 2) : 0} из{' '}
                  {task.qaPlannedTime ? roundNum(task.qaPlannedTime, 2) : 0} {localize[lang].H}.
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {this.state.isPerformerModalOpen ? (
          <PerformerModal
            defaultUser={task.performer ? task.performer.id : null}
            onChoose={this.changePerformer}
            onClose={this.closePerformerModal}
            title={localize[lang].CHANGE_PERFORMER}
            users={users}
          />
        ) : null}
        {this.state.isSprintModalOpen ? (
          <SprintModal
            defaultSprint={task.sprint ? task.sprint.id : 0}
            onChoose={this.changeSprint}
            onClose={this.closeSprintModal}
            title={localize[lang].CHANGE_SPRINT}
            sprints={sprints}
          />
        ) : null}
        {this.state.isTaskTypeModalOpen ? (
          <TaskTypeModal
            defaultTypeId={task ? task.typeId : null}
            onChoose={this.changeTaskType}
            onClose={this.closeTaskTypeModal}
          />
        ) : null}
        {this.state.isTaskGoalModalOpen ? (
          <TaskGoalModal
            defaultGoal={task.goals && task.goals[0] ? task.goals[0].id : null}
            onChoose={this.changeGoal}
            onClose={this.closeTaskGoalModal}
            title={localize[lang].CHANGE_GOAL}
            goals={goals}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.Project.project.users,
  sprints: state.Project.project.sprints,
  taskTypes: getLocalizedTaskTypes(state),
  goals: state.Goals.goals,
  PlanningTimeIsEditing: state.Task.PlanningTimeIsEditing,
  ExecutionTimeIsEditing: state.Task.ExecutionTimeIsEditing,
  timeSpent: state.Task.timeSpent,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getProjectUsers,
  getProjectSprints,
  getTask,
  getTaskSpent,
  getGoalsBySprint
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);
