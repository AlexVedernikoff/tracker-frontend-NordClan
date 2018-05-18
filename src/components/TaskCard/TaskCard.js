import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';
import ReactTooltip from 'react-tooltip';

import { history } from '../../History';
import getTypeById from '../../utils/TaskTypes';
import getProrityById from '../../utils/TaskPriority';
import roundNum from '../../utils/roundNum';
import { TASK_CARD } from '../../constants/DragAndDrop';
import PriorityBox from './PriorityBox';
import * as css from './TaskCard.scss';
import CopyThis from '../../components/CopyThis';
import { IconPlay, IconPause, IconTime, IconBug, IconEdit } from '../Icons';
import RelatedTask from './RelatedTask';

const taskCardSource = {
  beginDrag(props) {
    return {
      id: props.task.id,
      section: props.section,
      statusId: props.task.statusId
    };
  }
};

const getTaskTime = (factTime, planTime) => {
  if (factTime) {
    return planTime ? `${roundNum(factTime, 2)} из ${roundNum(planTime, 2)} ч.` : `${roundNum(factTime, 2)} ч.`;
  } else {
    return planTime ? `0 из ${roundNum(planTime, 2)} ч.` : '0 из 0 ч.';
  }
};

function collect(connection, monitor) {
  return {
    connectDragSource: connection.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const STATUS_NEW = 1;
const STATUS_DEV_PROGRESS = 2;
const STATUS_DEV_HOLD = 3;
const STATUS_REVIEW_PROGRESS = 4;
const STATUS_REVIEW_HOLD = 5;
const STATUS_QA_PROGRESS = 6;
const STATUS_QA_HOLD = 7;
const STATUS_DONE = 8;

class TaskCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpenPriority: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.task.statusId !== nextProps.task.statusId) {
      ReactTooltip.hide();
    }
  }

  handleClick = event => {
    event.stopPropagation();
    const { task, onChangeStatus } = this.props;
    onChangeStatus(task.id, task.statusId);
  };

  handlePerformerClick = event => {
    event.stopPropagation();
    const { task, onOpenPerformerModal } = this.props;
    onOpenPerformerModal(task.id, task.performer ? task.performer.id : null);
  };

  togglePriorityBox = () => {
    this.setState({ isOpenPriority: !this.state.isOpenPriority });
  };

  showPriorityBox = event => {
    event.stopPropagation();
    this.togglePriorityBox();
  };

  isTaskInWork = statusId => statusId !== STATUS_NEW && statusId !== STATUS_DONE;

  isTaskInProgress = statusId =>
    statusId === STATUS_DEV_HOLD || statusId === STATUS_REVIEW_HOLD || statusId === STATUS_QA_HOLD;

  isTaskInHold = statusId =>
    statusId === STATUS_DEV_PROGRESS || statusId === STATUS_REVIEW_PROGRESS || statusId === STATUS_QA_PROGRESS;

  isInPlan = (plannedTime, factTime) => factTime / plannedTime <= 1 && plannedTime;

  isOutOfPlan = (plannedTime, factTime) => factTime / plannedTime > 1 && plannedTime;

  goToDetailPage = () => {
    history.push(`/projects/${this.props.task.projectId}/tasks/${this.props.task.id}`);
  };

  render() {
    const {
      task,
      connectDragSource,
      isDragging,
      onChangeStatus,
      onOpenPerformerModal,
      myTaskBoard,
      section,
      taskTypes,
      isExternal,
      lightTask,
      lighted,
      lightedTaskId,
      ...other
    } = this.props;

    const factPlanDivision = task.factExecutionTime / task.plannedExecutionTime;
    const isSubtasks = task.subTasks.length;
    const isLinkedTasks = task.linkedTasks.length;
    const isParent = task.parentTask;

    const classPriority = 'priority-' + task.prioritiesId;
    const isBug = [2, 4, 5].includes(task.typeId);

    return connectDragSource(
      <div className={classnames([css.taskWrapper, { [css.dropped]: isDragging }])}>
        {isParent && !isDragging ? (
          <RelatedTask
            onHover={lightTask}
            task={task.parentTask}
            isLighted={lightedTaskId === task.parentTask.id}
            mode="parent"
            prefix={task.prefix}
          />
        ) : null}
        <div
          className={classnames({
            [css.taskCard]: true,
            [css[classPriority]]: true,
            [css.bug]: isBug
          })}
          onMouseEnter={() => lightTask(task.id, false)}
          onMouseLeave={() => lightTask(null, false)}
          onClick={this.goToDetailPage}
          {...other}
        >
          {this.isTaskInWork(task.statusId) && (
            <div
              className={classnames({
                [css.status]: true,
                [css.inhold]: this.isTaskInHold(task.statusId),
                [css.inprogress]: this.isTaskInProgress(task.statusId)
              })}
            >
              {this.isTaskInProgress(task.statusId) ? (
                <IconPlay data-tip="Начать" onClick={this.handleClick} />
              ) : (
                <IconPause data-tip="Приостановить" onClick={this.handleClick} />
              )}
            </div>
          )}

          <CopyThis
            wrapThisInto={'div'}
            isCopiedBackground
            description={`Ссылка на задачу ${task.prefix}-${task.id}`}
            textToCopy={`${location.origin}${history.createHref(`/projects/${task.projectId}/tasks/${task.id}`)}`}
          >
            <div className={css.header}>
              <span className={css.taskNum}>
                {isBug ? <IconBug style={{ verticalAlign: 'top' }} /> : null} {task.prefix}-{task.id}
              </span>{' '}
              | {getTypeById(task.typeId, taskTypes)}
            </div>
          </CopyThis>

          <div>
            <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className={css.taskName}>
              {task.name}
            </Link>
          </div>

          <p className={css.taskMeta} onClick={this.handlePerformerClick}>
            {!myTaskBoard && (
              <span className={css.performer}>
                {task.performer ? (
                  <span>
                    {task.performer.fullNameRu}
                    <span className={css.preformerEditIcon}>
                      <IconEdit />
                    </span>
                  </span>
                ) : (
                  <span className={css.unassigned}>Не назначено</span>
                )}
              </span>
            )}
          </p>

          {!!(task.factExecutionTime || task.plannedExecutionTime) &&
            !isExternal && (
              <p className={classnames(css.time, { [css.redBorder]: +task.plannedExecutionTime === 0 })}>
                <IconTime
                  className={classnames({
                    [css.green]: this.isInPlan(task.plannedExecutionTime, task.factExecutionTime),
                    [css.red]: this.isOutOfPlan(task.plannedExecutionTime, task.factExecutionTime)
                  })}
                />
                <span>{getTaskTime(task.factExecutionTime, task.plannedExecutionTime)}</span>
              </p>
            )}

          {!!task.plannedExecutionTime &&
            !isExternal && (
              <div className={css.progressBar}>
                <div
                  style={{ width: factPlanDivision < 1 ? factPlanDivision * 100 + '%' : '100%' }}
                  className={classnames({
                    [css.green]: this.isInPlan(task.plannedExecutionTime, task.factExecutionTime),
                    [css.red]: this.isOutOfPlan(task.plannedExecutionTime, task.factExecutionTime)
                  })}
                />
              </div>
            )}

          {this.state.isOpenPriority ? (
            <PriorityBox
              taskId={task.id}
              isTime={!!(task.factExecutionTime || task.plannedExecutionTime)}
              priorityId={task.prioritiesId}
              hideBox={this.togglePriorityBox}
            />
          ) : (
            <div
              className={css.priorityMarker}
              onClick={this.showPriorityBox}
              data-tip={`Приоритет: ${getProrityById(this.props.task.prioritiesId)}`}
            />
          )}
          {lighted ? <div className={css.lightedBorder} /> : null}
        </div>
        {isSubtasks && !isDragging ? (
          <div className={css.subTasks}>
            {task.subTasks.map(subTask => (
              <RelatedTask
                key={subTask.id}
                onHover={lightTask}
                task={subTask}
                isLighted={lightedTaskId === subTask.id}
                mode="sub"
                prefix={task.prefix}
              />
            ))}
          </div>
        ) : null}
        {isLinkedTasks && !isDragging ? (
          <div className={css.linkedTasks}>
            {task.linkedTasks.map(linkedTask => (
              <RelatedTask
                key={linkedTask.id}
                onHover={lightTask}
                task={linkedTask}
                isLighted={lightedTaskId === linkedTask.id}
                mode="linked"
                prefix={task.prefix}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

TaskCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool,
  lightTask: PropTypes.func.isRequired,
  lighted: PropTypes.bool,
  lightedTaskId: PropTypes.number,
  myTaskBoard: PropTypes.any,
  onChangeStatus: PropTypes.func.isRequired,
  onOpenPerformerModal: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  task: PropTypes.object,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  taskTypes: state.Dictionaries.taskTypes
});

export default DragSource(TASK_CARD, taskCardSource, collect)(connect(mapStateToProps, {})(TaskCard));
