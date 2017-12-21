import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import TaskPlanningTime from '../TaskPlanningTime';
import PerformerModal from '../../../components/PerformerModal';
import SprintModal from '../../../components/SprintModal';
import TaskTypeModal from '../../../components/TaskTypeModal';
import getTypeById from '../../../utils/TaskTypes';
import { getProjectUsers, getProjectSprints } from '../../../actions/Project';
import { connect } from 'react-redux';
import * as css from './Details.scss';
import moment from 'moment';
import roundNum from '../../../utils/roundNum';
import * as TaskStatuses from '../../../constants/TaskStatuses';
import { getTaskSpent } from '../../../actions/Task';
import _ from 'lodash';

const getJobById = status => {
  switch (status) {
  case TaskStatuses.DEV_PLAY:
  case TaskStatuses.DEV_STOP:
    return 'Develop';
  case TaskStatuses.QA_PLAY:
  case TaskStatuses.QA_STOP:
    return 'QA';
  case TaskStatuses.CODE_REVIEW_STOP:
  case TaskStatuses.CODE_REVIEW_PLAY:
    return 'Code Review';
  default:
    return 'Another';
  }
};

const spentRequestStatus = {
  READY: 0,
  REQUESTED: 1,
  RECEIVED: 2
};

class Details extends Component {
  static propTypes = {
    getProjectSprints: PropTypes.func.isRequired,
    getProjectUsers: PropTypes.func.isRequired,
    getTaskSpent: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    sprints: PropTypes.array,
    task: PropTypes.object.isRequired,
    timeSpent: PropTypes.array,
    taskTypes: PropTypes.array,
    users: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.state = {
      tooltipKey: 0,
      isSprintModalOpen: false,
      isPerformerModalOpen: false,
      isTaskTypeModalOpen: false,
      spentRequestStatus: spentRequestStatus.READY
    };
  }

  componentWillReceiveProps (props) {
    if (props.task.id !== this.props.task.id) {
        // this.props.getTaskSpent(props.task.id);
    }
    if (props.timeSpent !== this.props.timeSpent) {
      // console.log(props.timeSpent);
        // const filtered = props.timeSpent.map()
      this.setState({spentRequestStatus: spentRequestStatus.RECEIVED, tooltipKey: Math.random()});
    }
  }

  // Действия со спринтами
  openSprintModal = () => {
    this.props.getProjectSprints(this.props.task.project.id);
    this.setState({ isSprintModalOpen: true });
  };

  closeSprintModal = () => {
    this.setState({ isSprintModalOpen: false });
  };

  changeSprint = (sprintId) => {
    this.props.onChange({
      id: this.props.task.id,
      sprintId: sprintId
    }, sprintId);
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

  changePerformer = (performerId) => {
    this.props.onChange({
      id: this.props.task.id,
      performerId: performerId
    }, this.props.task.id);
    this.closePerformerModal();
  };

  // Действия с типом задачи
  openTaskTypeModal = () => {
    this.setState({ isTaskTypeModalOpen: true });
  };

  closeTaskTypeModal = () => {
    this.setState({ isTaskTypeModalOpen: false });
  };

  changeTaskType = (typeId) => {
    this.props.onChange({
      id: this.props.task.id,
      typeId: typeId
    }, this.props.task.id);

    this.closeTaskTypeModal();
  };

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  spentTooltipRender (spents) {
    return _.chain(spents)
    .map(spent => ({job: getJobById(spent.taskStatusId), spent: spent.spentTime }))
    .transform((byStatus, spent) => {
      const job = spent.job;
      byStatus[job] += Number(spent.spent) + byStatus[job] ? byStatus[job] : 0;
    }, {})
    .transform((spentsList, spentTime, status) => {
      spentsList.push(
          <div className={css.timeString} key={status}>
            <span>{status}:</span>{spentTime} ч.
          </div>
      );
    }, [])
    .value();
  }

  onTooltipVisibleChange = () => {
    const currentStatus = this.state.spentRequestStatus;
    if (this.state.spentRequestStatus === spentRequestStatus.READY) {
      this.setState({
        spentRequestStatus: spentRequestStatus.REQUESTED
      });
      this.props.getTaskSpent(this.props.task.id);
    }
  }

  render () {
    const { task, sprints, taskTypes, timeSpent } = this.props;
    const tags = task.tags.map((tag, i) => {
      const tagName = (typeof tag === 'object') ? tag.name : tag;
      return <Tag key={i}
                  name={tagName}
                  taggable="task"
                  taggableId={task.id}/>;
    });

    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? item.user.fullNameRu : item.fullNameRu
    }));

    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            {task.project
              ? <tr>
                  <td>Проект:</td>
                  <td>
                    <Link to={'/projects/' + this.props.task.project.id}>
                      {task.project.name}
                    </Link>
                  </td>
                </tr>
              : null}
            <tr>
              <td>Тип задачи:</td>
              <td>
                <a onClick={this.openTaskTypeModal}>
                  {getTypeById(task.typeId, taskTypes)}
                </a>
              </td>
            </tr>
              <tr>
                <td>Спринт:</td>
                <td>
                  <a onClick={this.openSprintModal}>
                    { task.sprint
                      ? task.sprint.name
                      : 'Backlog'
                    }
                  </a>
                    {/*<Link to={`/projects/${task.projectId}/agile-board`}>*/}
                      {/*{task.sprint ? task.sprint.name : 'Backlog'}*/}
                    {/*</Link>*/}
                </td>
              </tr>
            <tr>
              <td>Теги:</td>
              <td className={css.tags}>
                <Tags taggable="task"
                      taggableId={task.id}
                      create>
                  {tags}
                </Tags>
              </td>
            </tr>
            {task.author
              ? <tr>
                  <td>Автор:</td>
                  <td>
                     {task.author.fullNameRu}
                  </td>
                </tr>
              : null}
              <tr>
                <td>Исполнитель:</td>
                <td>
                  <a onClick={this.openPerformerModal}>
                    { task.performer
                      ? task.performer.fullNameRu
                      : <span className={css.unassigned}>Не назначено</span>
                    }
                  </a>
                </td>
              </tr>
            <tr>
              <td>Дата создания:</td>
              <td>
                {moment(this.props.task.createdAt).format('DD.MM.YYYY')}
              </td>
            </tr>
            <tr>
              <td>Запланировано:</td>
              <td>
                <TaskPlanningTime time={task.plannedExecutionTime ? task.plannedExecutionTime : '0'} id={task.id} />
              </td>
            </tr>
            { task.factExecutionTime
              ? <tr>
                  <td>Потрачено:</td>
                  <td>
                    <span
                      key={this.state.tooltipKey}
                      data-tip
                      data-place="right"
                      data-for={this.state.spentRequestStatus === spentRequestStatus.RECEIVED ? 'time' : 'notime'}
                      className={classnames({
                        [css.alert]: true,
                        [css.factTime]: true
                      })}
                    >
                       {`${roundNum(task.factExecutionTime, 2)} ч.`}
                    </span>
                  </td>
                </tr>
              : null }
          </tbody>
        </table>
        {
          this.state.spentRequestStatus === spentRequestStatus.RECEIVED
            ? <ReactTooltip id="time"
              destroyTooltipOnHide
              aria-haspopup="true"
              className="tooltip"
              getContent={() => this.spentTooltipRender(timeSpent)}
            />
            : <ReactTooltip id="notime"
              destroyTooltipOnHide
              aria-haspopup="true"
              className="tooltip"
              afterShow={this.onTooltipVisibleChange}
              getContent={() => <div> loading... </div>}
            />
        }
        {
          this.state.isPerformerModalOpen
          ? <PerformerModal
              defaultUser={task.performer ? task.performer.id : null}
              onChoose={this.changePerformer}
              onClose={this.closePerformerModal}
              title="Изменить исполнителя задачи"
              users={users}
            />
          : null
        }
        {
          this.state.isSprintModalOpen
          ? <SprintModal
              defaultSprint={task.sprint ? task.sprint.id : null}
              onChoose={this.changeSprint}
              onClose={this.closeSprintModal}
              title="Изменить спринт задачи"
              sprints={sprints}
            />
          : null
        }
        {
          this.state.isTaskTypeModalOpen
          ? <TaskTypeModal
              defaultTypeId={task ? task.typeId : null}
              onChoose={this.changeTaskType}
              onClose={this.closeTaskTypeModal}
            />
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.Project.project.users,
  sprints: state.Project.project.sprints,
  taskTypes: state.Dictionaries.taskTypes,
  timeSpent: state.Task.timeSpent
});

const mapDispatchToProps = {
  getProjectUsers,
  getProjectSprints,
  getTaskSpent
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
