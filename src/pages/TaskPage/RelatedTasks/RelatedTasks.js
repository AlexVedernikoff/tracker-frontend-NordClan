import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconPlus, IconLink, IconUnLink, IconClose } from '../../../components/Icons';
import classnames from 'classnames';
import * as css from './RelatedTasks.scss';
import { connect } from 'react-redux';
import localize from './RelatedTasks.json';

class RelatedTasks extends React.Component {
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
            data-tip={localize[this.props.lang].CANCEL_TASK}
            onClick={() => {
              this.props.onDelete(task.id);
            }}
          />
        );

      case 'linkedTasks':
        return (
          <IconUnLink
            className={css.iconClose}
            data-tip={localize[this.props.lang].UNBIND_TASK}
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
    const { lang } = this.props;
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    const tasks = this.props.task[this.props.type].map(task => {
      return (
        <li key={`${this.props.type}-${task.id}`} className={this.taskStyle(task.statusId)}>
          <span className={css.taskLabel}>{`${this.props.task.project.prefix}-${task.id}`}</span>
          <Link className="underline-link" to={`/projects/${this.props.task.project.id}/tasks/${task.id}`}>
            {task.name}
          </Link>
          {this.props.onDelete ? this.getActionIcon(task) : null}
        </li>
      );
    });

    return (
      <div className={css.relatedTasks}>
        <h3>
          {this.props.type === 'linkedTasks'
            ? localize[lang].BINDED_TASKS
            : this.props.type === 'subTasks'
              ? localize[lang].SUBTASKS
              : null}
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
              ? localize[lang].BOUND_WITH_OTHER_TASK
              : this.props.type === 'subTasks'
                ? localize[lang].ADD_SUBTASKS
                : null}
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(RelatedTasks);
