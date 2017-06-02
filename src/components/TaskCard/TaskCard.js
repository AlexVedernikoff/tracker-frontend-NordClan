import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

import { IconPlay, IconPause } from '../Icons';
import * as css from './TaskCard.scss';

const TaskCard = (props) => {
  const {
    task,
    ...other
  } = props;

  const classPriority = 'priority-' + task.priority;

  return (
    <div className={classnames([css.taskCard], [css[classPriority]])} {...other}>
      <div className={classnames({
        [css.status]: true,
        [css.inhold]: task.status === 'INHOLD',
        [css.inprogress]: task.status === 'INPROGRESS'
      })}>
        {
          task.status === 'INHOLD'
          ? <IconPause/>
          : <IconPlay/>
        }
      </div>
      <Link to={`/tasks/${task.id}`} className={css.taskName}>{task.name}</Link>
      <p className={css.taskMeta}>
        <span>Подзадач:</span>
        <span>{task.subtasks}</span>
      </p>
      <p className={css.taskMeta}>
        <span>Исполнитель:</span>
        <span><Link to={`users/${5}`}>{task.executor}</Link></span>
      </p>
      <p className={css.taskMeta}>
        <span>Время:</span>
        <span>({task.factTime} ч. из {task.plannedTime})</span>
      </p>
      <div className={css.progressBar}>
        <div
          style={{width: (task.factTime / task.plannedTime) < 1 ? (task.factTime / task.plannedTime) * 100 + '%' : '100%'}}
          className={classnames({
            [css.green]: (task.factTime / task.plannedTime) <= 1,
            [css.red]: (task.factTime / task.plannedTime) > 1
          })}
          />
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object
};

export default TaskCard;
