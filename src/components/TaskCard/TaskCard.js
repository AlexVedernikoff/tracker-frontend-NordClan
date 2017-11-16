import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';
import { history } from '../../History';
import getTypeById from '../../utils/TaskTypes';
import { TASK_CARD } from '../../constants/DragAndDrop';

import * as css from './TaskCard.scss';
import PriorityBox from './PriorityBox';
import CopyThis from '../../components/CopyThis';
import { IconPlay, IconPause, IconTime } from '../Icons';

const taskCardSource = {
  beginDrag (props) {
    return {
      id: props.task.id,
      section: props.section,
      statusId: props.task.statusId
    };
  }
};

const getTaskTime = (factTime, planTime) => {
  if (factTime) {
    return planTime ? `${factTime} из ${planTime} ч.` : `${factTime} ч.`;
  } else {
    return planTime ? `0 из ${planTime} ч.` : '0 из 0 ч.';
  }
};

function collect (connection, monitor) {
  return {
    connectDragSource: connection.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class TaskCard extends React.Component {
  constructor (props) {
    super(props);
    this.state = { isOpenPriority: false };
  }

  handleClick = () => {
    const { task, onChangeStatus } = this.props;
    onChangeStatus(task.id, task.statusId);
  };

  handlePerformerClick = () => {
    const { task, onOpenPerformerModal } = this.props;
    onOpenPerformerModal(task.id, task.performer ? task.performer.id : null);
  };

  togglePriorityBox = () => {
    this.setState({ isOpenPriority: !this.state.isOpenPriority });
  };

  render () {
    const {
      task,
      connectDragSource,
      isDragging,
      onChangeStatus,
      onOpenPerformerModal,
      myTaskBoard,
      section,
      taskTypes,
      ...other
    } = this.props;

    const classPriority = 'priority-' + task.prioritiesId;

    return (
      connectDragSource(
        <div className={classnames({[css.taskCard]: true, [css[classPriority]]: true, [css.dropped]: isDragging})} {...other}>
          {
            task.statusId !== 1 && task.statusId !== 8
            ? <div
              className={classnames({
                [css.status]: true,
                [css.inhold]: task.statusId === 2 || task.statusId === 4 || task.statusId === 6,
                [css.inprogress]: task.statusId === 3 || task.statusId === 5 || task.statusId === 7
              })}>
              {
                task.statusId === 3 || task.statusId === 5 || task.statusId === 7
                ? <IconPlay data-tip="Начать" onClick={this.handleClick} />
                : <IconPause data-tip="Приостановить" onClick={this.handleClick} />
              }
            </div>
            : null
          }
          <CopyThis
            wrapThisInto={'div'}
            isCopiedBackground
            textToCopy={`${location.origin}${history.createHref(
              `/projects/${task.projectId}/tasks/${task.id}`
            )}`}
          >
            <div className={css.header}>
              {task.prefix}-{task.id} | {getTypeById(task.typeId, taskTypes)}
            </div>
          </CopyThis>
          <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className={css.taskName}>
            <div>{task.name}</div>
          </Link>
          <p className={css.taskMeta} onClick={this.handlePerformerClick}>
            {!myTaskBoard ? <a>
              { task.performer
                ? task.performer.fullNameRu
                : <span className={css.unassigned}>Не назначено</span>
              }
            </a> : null}
          </p>
          {
            task.factExecutionTime || task.plannedExecutionTime
            ? <p className={css.time}>
              <IconTime className={classnames({
                [css.green]: (task.factExecutionTime / task.plannedExecutionTime) <= 1 && task.plannedExecutionTime,
                [css.red]: (task.factExecutionTime / task.plannedExecutionTime) > 1 && task.plannedExecutionTime
              })} />
            <span>{getTaskTime(task.factExecutionTime, task.plannedExecutionTime)}</span>
          </p>
            : null
          }
          {
            task.plannedExecutionTime
              ? <div className={css.progressBar}>
                <div
                  style={{width: (task.factExecutionTime / task.plannedExecutionTime) < 1 ? (task.factExecutionTime / task.plannedExecutionTime) * 100 + '%' : '100%'}}
                  className={classnames({
                    [css.green]: (task.factExecutionTime / task.plannedExecutionTime) <= 1 && task.plannedExecutionTime,
                    [css.red]: (task.factExecutionTime / task.plannedExecutionTime) > 1 && task.plannedExecutionTime
                  })}
                />
              </div>
              : null
          }
          {
            this.state.isOpenPriority
            ? <PriorityBox
              taskId={task.id}
              isTime={!!(task.factExecutionTime || task.plannedExecutionTime)}
              priorityId={task.prioritiesId}
              hideBox={this.togglePriorityBox}
            />
            : <div className={css.priorityMarker} onClick={this.togglePriorityBox}/>
          }
        </div>
      )
    );
  }
}

TaskCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
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
