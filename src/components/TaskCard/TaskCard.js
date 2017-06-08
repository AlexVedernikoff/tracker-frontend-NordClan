import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

import { IconPlay, IconPause, IconTime } from '../Icons';
import * as css from './TaskCard.scss';

const TaskCard = (props) => {
  const {
    task,
    ...other
  } = props;

  const classPriority = 'priority-' + task.priority;

  return (
    <div className={classnames([css.taskCard], [css[classPriority]])} {...other}>
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
  );
};

TaskCard.propTypes = {
  task: PropTypes.object
};

export default TaskCard;
