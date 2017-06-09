import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import { IconPlay, IconPause, IconTime } from '../Icons';
import Tags from '../Tags';
import Tag from '../Tag';
import * as css from './TaskRow.scss';

const TaskRow = (props) => {
  const {
    task,
    ...other
  } = props;

  const classPriority = 'priority-' + task.priority;
  const tags = task.tags.map((element, i) => <Tag key={i} name={element}/>);
  console.log(task.tags);

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
      <Row>
        <Col xs={6}>
          <div className={css.header}>
            <div>
              <div className={css.priorityMarker} data-tip={`Приоритет: ${task.priority}`}>{task.priority}</div>
            </div>
            <div className={css.prefix}>{task.prefix}</div>
            <div className={css.type}>{task.type}</div>
            <div className={css.type}>
              На стадии:
              {
                task.stage === 'NEW'
                ? ' New'
                : task.stage === 'DEVELOP'
                ? ' Develop'
                : task.stage === 'CODE_REVIEW'
                ? ' Code Review'
                : task.stage === 'QA'
                ? ' QA'
                : task.stage === 'DONE'
                ? ' Done'
                : null
              }
            </div>
          </div>
          <Link to={`/projects/5/tasks/${task.id}`} className={css.taskName}>
            <h4>
              {task.name}
            </h4>
          </Link>
        </Col>
        <Col xs={3}>
          <div className={css.metabox}>
            <p className={css.taskMeta}>
              <span>Спринт:</span><span><Link to="/projects/1">{task.sprint}</Link></span>
            </p>
            <p className={css.taskMeta}>
              <span>Исполнитель:</span><span><Link to={`users/${5}`}>{task.executor}</Link></span>
            </p>
            <p className={css.taskMeta}>
              <span>Время:</span><span>{task.factTime} ч. из {task.plannedTime}</span>
            </p>
          </div>
        </Col>
        <Col xs>
          <div className={css.tagbox}>
            <Tags>{tags}</Tags>
          </div>
        </Col>
      </Row>
      <div className={css.progressBar}>
        <div
          style={{width: (task.stage === 'NEW') ? 0 : ((task.factTime / task.plannedTime) < 1) ? (task.factTime / task.plannedTime) * 100 + '%' : '100%'}}
          className={classnames({
            [css.green]: (task.factTime / task.plannedTime) <= 1,
            [css.red]: (task.factTime / task.plannedTime) > 1
          })}
          />
      </div>
    </div>
  );
};

TaskRow.propTypes = {
  task: PropTypes.object
};

export default TaskRow;
