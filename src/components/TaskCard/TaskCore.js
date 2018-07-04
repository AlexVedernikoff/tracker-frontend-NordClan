import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';

import { TASK_CARD } from '../../constants/DragAndDrop';
import { IconPlay, IconPause, IconTime, IconBug, IconEdit } from '../Icons';
import { history } from '../../History';
import CopyThis from '../../components/CopyThis';
import PriorityBox from './PriorityBox';
import getTypeById from '../../utils/TaskTypes';
import roundNum from '../../utils/roundNum';
import getProrityById from '../../utils/TaskPriority';
import taskStatus from '../../constants/TaskStatuses';
import * as css from './TaskCard.scss';

const taskCardSource = {
  beginDrag(props) {
    return {
      id: props.task.id,
      section: props.section,
      statusId: props.task.statusId
    };
  }
};

function collect(connection, monitor) {
  return {
    connectDragSource: connection.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const getTaskTime = (factTime, planTime) => {
  if (factTime) {
    return planTime ? `${roundNum(factTime, 2)} из ${roundNum(planTime, 2)} ч.` : `${roundNum(factTime, 2)} ч.`;
  } else {
    return planTime ? `0 из ${roundNum(planTime, 2)} ч.` : '0 из 0 ч.';
  }
};

class TaskCore extends PureComponent {
  static propTypes = {
    classPriority: PropTypes.string,
    connectDragSource: PropTypes.func,
    factPlanDivision: PropTypes.number,
    isBug: PropTypes.bool,
    isDragging: PropTypes.bool,
    isExternal: PropTypes.bool,
    lightTask: PropTypes.func,
    lighted: PropTypes.bool,
    myTaskBoard: PropTypes.bool,
    onChangeStatus: PropTypes.func,
    onOpenPerformerModal: PropTypes.func,
    section: PropTypes.string.isRequired,
    task: PropTypes.object,
    taskTypes: PropTypes.array
  };

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
    statusId === taskStatus.STATUS_DEV_HOLD || statusId === STATUS_REVIEW_HOLD || statusId === STATUS_QA_HOLD;

  isTaskInHold = statusId =>
    statusId === STATUS_DEV_PROGRESS || statusId === STATUS_REVIEW_PROGRESS || statusId === STATUS_QA_PROGRESS;

  isInPlan = (plannedTime, factTime) => factTime / plannedTime <= 1 && plannedTime;

  isOutOfPlan = (plannedTime, factTime) => factTime / plannedTime > 1 && plannedTime;

  goToDetailPage = () => {
    history.push(`/projects/${this.props.task.projectId}/tasks/${this.props.task.id}`);
  };

  render() {
    const {
      classPriority,
      isBug,
      lightTask,
      task,
      taskTypes,
      section,
      myTaskBoard,
      isExternal,
      lighted,
      factPlanDivision,
      onChangeStatus,
      onOpenPerformerModal,
      connectDragSource,
      isDragging,
      ...other
    } = this.props;

    return connectDragSource(
      <div
        className={classnames({
          [css.taskCard]: true,
          [css[classPriority]]: true,
          [css.bug]: isBug,
          [css.dropped]: isDragging
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
            {taskStatus.isTaskInProgress(task.statusId) ? (
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
    );
  }
}

export default DragSource(TASK_CARD, taskCardSource, collect)(TaskCore);
