import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import getTypeById from '../../utils/TaskTypes';
import getStatusNameById from '../../utils/TaskStatuses';

import Tags from '../Tags';
import Tag from '../Tag';
import * as css from './TaskRow.scss';

const getTaskTime = (factTime, planTime) => {
  if (factTime) {
    return planTime ? `${factTime} из ${planTime} ч.` : `${factTime} ч.`;
  } else {
    return planTime ? `0 из ${planTime} ч.` : '0 из 0 ч.';
  }
};

class TaskRow extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    const {
      prefix,
      task,
      shortcut,
      card,
      isDragging,
      ...other
    } = this.props;

    const classPriority = 'priority-' + task.prioritiesId;
    const tags = task.tags.map((element, i) => <Tag key={i} name={element.name} blocked/>);

    return (
    <div className={classnames({[css.taskCard]: true, [css[classPriority]]: true, [css.card]: card, [css.dropped]: isDragging})} {...other}>
      <Row>
        <Col xs={shortcut ? 12 : 6}>
          <div className={css.header}>
            <div>
              <div className={css.priorityMarker} data-tip={`Приоритет: ${task.prioritiesId}`}>{task.prioritiesId}</div>
            </div>
            <div className={css.prefix}>{`${prefix}-${task.id}`}</div>
            <div className={css.type}>{getTypeById(task.typeId)}</div>
            <div className={css.type}>{`На стадии: ${getStatusNameById(task.statusId)}`}</div>
            <div>
              {
                task.statusId === 2 || task.statusId === 4 || task.statusId === 6
                ? <span className={css.greenText}>В процессе</span>
                : task.statusId === 3 || task.statusId === 5 || task.statusId === 7
                ? 'Приостановлено'
                : null
              }
            </div>
          </div>
          <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className={css.taskName}>
            <h4>
              {task.name}
            </h4>
          </Link>
        </Col>
        {
          !shortcut
          ? <Col xs>
            <div className={css.metabox}>
              <p className={css.taskMeta}>
                <span>Спринт:</span>
                <span>
                  <Link to={`/projects/${task.projectId}/agile-board`}>
                    {task.sprint ? task.sprint.name : 'Backlog'}
                  </Link>
                </span>
              </p>
              <p className={css.taskMeta}>
                <span>Исполнитель:</span>
                <span>
                  { task.performer
                    ? <Link to={`/users/${task.performer.id}`}>
                        {task.performer.fullNameRu}
                      </Link>
                    : 'Не назначено'
                  }
                </span>
              </p>
              <p className={css.taskMeta}>
                <span>Автор:</span>
                <span>
                  { task.author ? task.author.fullNameRu : '' }
                </span>
              </p>
              <p className={css.taskMeta}>
                {
                  task.statusId !== 1
                  ? <span className={css.time}>
                    <span>Время: </span>
                    <span className={classnames({
                      [css.redText]: task.plannedExecutionTime < task.factExecutionTime,
                      [css.greenText]: task.plannedExecutionTime > task.factExecutionTime})}>
                      { getTaskTime(task.factExecutionTime, task.plannedExecutionTime) }
                    </span>
                  </span>
                  : null
                }
              </p>
            </div>
          </Col>
          : null
        }

        {
          !shortcut
          ? <Col xs>
            <div className={css.tagbox}>
              <Tags>{tags}</Tags>
            </div>
          </Col>
          : null
        }

      </Row>
      {/*<div className={css.progressBar}>
        <div
          style={{width: (task.stage === 'NEW') ? 0 : ((task.factTime / task.plannedTime) < 1) ? (task.factTime / task.plannedTime) * 100 + '%' : '100%'}}
          className={classnames({
            [css.green]: (task.factTime / task.plannedTime) <= 1,
            [css.red]: (task.factTime / task.plannedTime) > 1
          })}
          />
      </div>*/}
    </div>
    );
  }
}

TaskRow.propTypes = {
  card: PropTypes.bool,
  isDragging: PropTypes.bool,
  prefix: PropTypes.string,
  shortcut: PropTypes.bool,
  task: PropTypes.object
};

export default TaskRow;