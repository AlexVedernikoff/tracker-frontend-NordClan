import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconPlay, IconPause, IconPlus, IconLink, IconUnLink, IconClose } from '../../../components/Icons';
import classnames from 'classnames';
import { isTaskInProgress, getStatusNameById } from '../../../utils/TaskStatuses';
import * as css from './RelatedTasks.scss';

export default class RelatedTasks extends React.Component {
  taskStyle = statusId => {
    return classnames({
      [css.task]: true,
      [css.completed]: statusId === 10
    });
  };

  getActionIcon(task) {
    switch (this.props.type) {
      case 'subTasks':
        return (
          <IconClose
            className={css.iconClose}
            data-tip="Отменить задачу"
            onClick={() => {
              this.props.onDelete(task.id);
            }}
          />
        );

      case 'linkedTasks':
        return (
          <IconUnLink
            className={css.iconClose}
            data-tip="Отвязать задачу"
            onClick={() => {
              this.props.onDelete(task.id);
            }}
          />
        );

      default:
        return null;
    }
  }

  render() {
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    const tasks = this.props.task[this.props.type].map(task => {
      return (
        <li key={`${this.props.type}-${task.id}`} className={this.taskStyle(task.statusId)}>
          <span className={css.taskLabel}>
            <div>
              <div>{`${this.props.task.project.prefix}-${task.id}`}</div>
              <div className={css.taskStatus}>{getStatusNameById(task.statusId)}</div>
            </div>
            <div className={css.taskStatusIcon}>{isTaskInProgress(task.statusId) ? <IconPlay /> : <IconPause />}</div>
          </span>
          <div className={css.taskLink}>
            <Link className="underline-link" to={`/projects/${this.props.task.project.id}/tasks/${task.id}`}>
              {task.name}
            </Link>
          </div>
          {this.props.onDelete ? this.getActionIcon(task) : null}
        </li>
      );
    });

    return (
      <div className={css.relatedTasks}>
        <h3>
          {this.props.type === 'linkedTasks' ? 'Связанные задачи' : this.props.type === 'subTasks' ? 'Подзадачи' : null}
        </h3>
        <ul className={css.taskList}>{tasks}</ul>
        <a onClick={this.props.onAction} className={classnames([css.task, css.add])}>
          {this.props.type === 'linkedTasks' ? (
            <IconLink style={iconStyles} />
          ) : this.props.type === 'subTasks' ? (
            <IconPlus style={iconStyles} />
          ) : null}
          <div className={css.tooltip}>
            {this.props.type === 'linkedTasks'
              ? 'Связать с другой задачей'
              : this.props.type === 'subTasks' ? 'Добавить подзадачу' : null}
          </div>
        </a>
      </div>
    );
  }
}

RelatedTasks.propTypes = {
  onAction: PropTypes.func,
  onDelete: PropTypes.func,
  task: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};
