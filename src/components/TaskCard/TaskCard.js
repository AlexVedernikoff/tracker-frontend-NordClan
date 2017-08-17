import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';
import { TASK_CARD } from '../../constants/DragAndDrop';

import { IconPlay, IconPause, IconTime } from '../Icons';
import * as css from './TaskCard.scss';

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

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const TaskCard = (props) => {
  const {
    task,
    connectDragSource,
    isDragging,
    onChangeStatus,
    onOpenPerformerModal,
    myTaskBoard,
    section,
    ...other
  } = props;

  const classPriority = 'priority-' + task.prioritiesId;

  const handleClick = () => {
    onChangeStatus(task.id, task.statusId);
  };

  const handlePerformerClick = () => {
    onOpenPerformerModal(task.id, task.performer ? task.performer.id : null);
  };

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
              ? <IconPlay data-tip="Начать" onClick={handleClick} />
              : <IconPause data-tip="Приостановить" onClick={handleClick} />
            }
          </div>
          : null
        }
        <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className={css.taskName}>
          <span className={css.prefix}>{`${task.prefix}-${task.id}`}.</span>
          {task.name}
        </Link>
        <p className={css.taskMeta} onClick={handlePerformerClick}>
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
        <div className={css.priorityMarker} data-tip={`Приоритет: ${task.prioritiesId}`}/>
      </div>
    )
  );
};

TaskCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onOpenPerformerModal: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  task: PropTypes.object
};

export default DragSource(TASK_CARD, taskCardSource, collect)(TaskCard);
