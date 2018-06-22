import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import getTypeById from '../../utils/TaskTypes';
import getStatusNameById from '../../utils/TaskStatuses';
import { connect } from 'react-redux';
import Tags from '../Tags';
import Tag from '../Tag';
import { IconEdit } from '../Icons';
import * as css from './TaskRow.scss';
import roundNum from '../../utils/roundNum';

const getTaskTime = (factTime, planTime) => {
  if (factTime) {
    return planTime ? `${roundNum(factTime, 2)} из ${roundNum(planTime, 2)} ч.` : `${roundNum(factTime, 2)} ч.`;
  } else {
    return planTime ? `0 из ${roundNum(planTime, 2)} ч.` : '0 из 0 ч.';
  }
};

class TaskRow extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePerformerClick = () => {
    const { task, onOpenPerformerModal } = this.props;
    onOpenPerformerModal(task.id, task.performer ? task.performer.id : null);
  };

  handleSprintClick = () => {
    const { task, onOpenSprintModal } = this.props;
    onOpenSprintModal(task.id, task.sprint ? task.sprint.id : null);
  };

  render() {
    const {
      prefix,
      task,
      shortcut,
      card,
      isDragging,
      draggable,
      onClickTag,
      taskTypes,
      onOpenPerformerModal,
      onOpenSprintModal,
      isExternal,
      ...other
    } = this.props;

    const classPriority = 'priority-' + task.prioritiesId;
    const tags = task.tags.map((element, i) => <Tag key={i} name={element.name} blocked onClick={onClickTag} />);

    return (
      <div
        className={classnames({
          [css.taskCard]: true,
          [css.draggable]: draggable,
          [css[classPriority]]: true,
          [css.card]: card,
          [css.dropped]: isDragging
        })}
        {...other}
      >
        <Row>
          <Col xs={12} sm={shortcut ? 12 : 6}>
            <div className={css.header}>
              <div>
                <div className={css.priorityMarker} data-tip={`Приоритет: ${task.prioritiesId}`}>
                  {task.prioritiesId}
                </div>
              </div>
              <div className={css.prefix}>{`${prefix}-${task.id}`}</div>
              <div className={css.type}>{getTypeById(task.typeId, taskTypes)}</div>
              <div className={css.type}>{`На стадии: ${getStatusNameById(task.statusId)}`}</div>
              <div>
                {task.statusId === 2 || task.statusId === 4 || task.statusId === 6 ? (
                  <span className={css.greenText}>В процессе</span>
                ) : task.statusId === 3 || task.statusId === 5 || task.statusId === 7 ? (
                  'Приостановлено'
                ) : null}
              </div>
            </div>
            <Link
              to={`/projects/${task.projectId}/tasks/${task.id}`}
              className={classnames([css.taskName, 'underline-link'])}
            >
              <h4>{task.name}</h4>
            </Link>
          </Col>
          {!shortcut ? (
            <Col xs={12} sm>
              <div className={css.metabox}>
                <p className={css.taskMeta}>
                  <span className={css.metaKey}>Спринт:</span>
                  <span className={css.metaValue} onClick={this.handleSprintClick}>
                    {task.sprint ? task.sprint.name : 'Backlog'}
                    <IconEdit />
                  </span>
                </p>
                <p className={css.taskMeta}>
                  <span className={css.metaKey}>Исполнитель:</span>
                  <span className={css.metaValue} onClick={this.handlePerformerClick}>
                    {task.performer ? task.performer.fullNameRu : 'Не назначено'}
                    <IconEdit />
                  </span>
                </p>
                <p className={css.taskMeta}>
                  <span className={css.metaKey}>Автор:</span>
                  <span>{task.author ? task.author.fullNameRu : ''}</span>
                </p>
                <p className={css.taskMeta}>
                  {task.statusId !== 1 && !isExternal ? (
                    <span className={css.time}>
                      <span className={css.metaKey}>Время: </span>
                      <span
                        className={classnames({
                          [css.redText]: task.plannedExecutionTime < task.factExecutionTime,
                          [css.greenText]: task.plannedExecutionTime > task.factExecutionTime
                        })}
                      >
                        {getTaskTime(task.factExecutionTime, task.plannedExecutionTime)}
                      </span>
                    </span>
                  ) : null}
                </p>
              </div>
            </Col>
          ) : null}

          {!shortcut ? (
            <Col xs>
              <div className={css.tagbox}>
                <Tags canEdit>{tags}</Tags>
              </div>
            </Col>
          ) : null}
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
  draggable: PropTypes.bool,
  isDragging: PropTypes.bool,
  isExternal: PropTypes.bool,
  onClickTag: PropTypes.func,
  onOpenPerformerModal: PropTypes.func,
  onOpenSprintModal: PropTypes.func,
  prefix: PropTypes.string,
  shortcut: PropTypes.bool,
  task: PropTypes.object,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  taskTypes: state.Dictionaries.taskTypes
});

export default connect(mapStateToProps, {})(TaskRow);
