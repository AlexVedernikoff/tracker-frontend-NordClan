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
      section: props.section
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
    prefix,
    section,
    ...other
  } = props;

  const classPriority = 'priority-' + task.prioritiesId;

  return (
    connectDragSource(
      <div className={classnames({[css.taskCard]: true, [css[classPriority]]: true, [css.dropped]: isDragging})} {...other}>
        {
          task.statusId !== 1 && task.stage !== 8
          ? <div
          className={classnames({
            [css.status]: true,
            [css.inhold]: task.statusId === 3 || task.statusId === 5 || task.statusId === 7,
            [css.inprogress]: task.statusId === 2 || task.statusId === 4 || task.statusId === 6
          })}>
            {
              task.status === task.statusId === 3 || task.statusId === 5 || task.statusId === 7
              ? <IconPlay data-tip="Начать"/>
              : <IconPause data-tip="Приостановить"/>
            }
          </div>
          : null
        }
        <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className={css.taskName}>
          <span className={css.prefix}>{`${prefix}-${task.id}`}.</span>
          {task.name}
        </Link>
        <p className={css.taskMeta}>
          <span><Link to={`/users/${task.executorId}`}>{task.executorId}</Link></span>
        </p>
        {
          task.statusId !== 1
          ? <p className={css.time}>
            <IconTime className={classnames({
              [css.green]: (task.FactExecutionTime / task.PlannedExecutionTime) <= 1,
              [css.red]: (task.FactExecutionTime / task.PlannedExecutionTime) > 1
            })} />
            <span>{task.FactExecutionTime} ч. из {task.PlannedExecutionTime}</span>
          </p>
          : null
        }
        {
          task.stage !== 1
          ? <div className={css.progressBar}>
            <div
              style={{width: (task.FactExecutionTime / task.PlannedExecutionTime) < 1 ? (task.FactExecutionTime / task.PlannedExecutionTime) * 100 + '%' : '100%'}}
              className={classnames({
                [css.green]: (task.FactExecutionTime / task.PlannedExecutionTime) <= 1,
                [css.red]: (task.FactExecutionTime / task.PlannedExecutionTime) > 1
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
  section: PropTypes.string.isRequired,
  task: PropTypes.object
};

export default DragSource(TASK_CARD, taskCardSource, collect)(TaskCard);
