import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconPlus, IconLink, IconClose } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal';

export default class RelatedTasks extends React.Component {
<<<<<<< HEAD

  isTaskCompleted (taskId) {
    if (taskId === 10 || taskId === 9) {
      return true;
    }
    return false;
  }

=======
>>>>>>> origin/develop
  render () {
    const css = require('./RelatedTasks.scss');

    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    const tasks = this.props.task[this.props.type].map(task => {
      return <li key={`${this.props.type}-${task.id}`} className={css.task}>
        <span className={css.taskLabel}>{`${this.props.task.project.prefix}-${task.id}`}</span>
        <Link to={`/projects/${this.props.task.project.id}/tasks/${task.id}`}>{task.name}</Link>
        {
          this.props.onDelete
            ? <IconClose
              className={css.iconClose}
              onClick={() => {this.props.onDelete(task.id);}}
            />
            : null
        }
      </li>;
    });

    return (
      <div className={css.relatedTasks}>
        <h3>
          {
            this.props.type === 'linkedTasks'
              ? 'Связанные задачи'
              : this.props.type === 'subTasks' ? 'Подзадачи' : null
          }
        </h3>
        <ul className={css.taskList}>
          {tasks}
        </ul>
        <a onClick={this.props.onAction} className={css.task + ' ' + css.add}>
          {
            this.props.type === 'linkedTasks'
              ? <IconLink style={iconStyles} />
              : this.props.type === 'subTasks' ? <IconPlus style={iconStyles} /> : null
          }
          <div className={css.tooltip}>
            {
              this.props.type === 'linkedTasks'
                ? 'Связать с другой задачей'
                : this.props.type === 'subTasks' ? 'Добавить подзадачу' : null
            }
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
