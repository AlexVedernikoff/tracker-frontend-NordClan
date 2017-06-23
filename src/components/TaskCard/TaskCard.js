import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../Constants';

import { IconPlay, IconPause, IconTime } from '../Icons';
import * as css from './TaskCard.scss';

const taskCardSource = {
  beginDrag (props) {
    return {
      id: props.task.id,
      section: props.task.section
    };
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
    ...other
  } = props;

  const classPriority = 'priority-' + task.priority;

  return (
    connectDragSource(
      <div className={classnames({[css.taskCard]: true, [css[classPriority]]: true, [css.dropped]: isDragging})} {...other}>
        {
          task.stage !== 'NEW' && task.stage !== 'DONE'
          ? <div
          className={classnames({
            [css.status]: true,
            [css.inhold]: task.status === 'INHOLD',
            [css.inprogress]: task.status === 'INPROGRESS'
          })}>
            {
              task.status === 'INHOLD'
              ? <IconPlay data-tip="Начать"/>
              : <IconPause data-tip="Приостановить"/>
            }
          </div>
          : null
        }
        <Link to={`/projects/5/tasks/${task.id}`} className={css.taskName}>
          <span className={css.prefix}>{task.prefix}.</span>
          {task.name}
        </Link>
        <p className={css.taskMeta}>
          <span><Link to={`users/${5}`}>{task.executor}</Link></span>
        </p>
        {
          task.stage !== 'NEW'
          ? <p className={css.time}>
            <IconTime className={classnames({
              [css.green]: (task.factTime / task.plannedTime) <= 1,
              [css.red]: (task.factTime / task.plannedTime) > 1
            })} />
            <span>{task.factTime} из {task.plannedTime}</span>
          </p>
          : null
        }
        {
          task.stage !== 'NEW'
          ? <div className={css.progressBar}>
            <div
              style={{width: (task.factTime / task.plannedTime) < 1 ? (task.factTime / task.plannedTime) * 100 + '%' : '100%'}}
              className={classnames({
                [css.green]: (task.factTime / task.plannedTime) <= 1,
                [css.red]: (task.factTime / task.plannedTime) > 1
              })}
              />
          </div>
          : null
        }
        <div className={css.priorityMarker} data-tip={`Приоритет: ${task.priority}`}/>
      </div>
    )
  );
};

TaskCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  task: PropTypes.object
};

export default DragSource(ItemTypes.TASK_CARD, taskCardSource, collect)(TaskCard);
