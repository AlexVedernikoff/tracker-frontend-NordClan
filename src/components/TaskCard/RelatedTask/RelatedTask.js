import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as css from '../TaskCard.scss';
import { Link } from 'react-router';
import { IconFileTree, IconLink } from '../../Icons';
import { scrollTo } from '../../../utils/scroll';
import localize from './relatedTask.json';

const CARD_IS_FOCUSED = true;

class componentName extends PureComponent {
  static propTypes = {
    isLighted: PropTypes.bool,
    mode: PropTypes.string,
    onHover: PropTypes.func,
    prefix: PropTypes.string,
    projectId: PropTypes.number,
    task: PropTypes.object,
    lang: PropTypes.string.isRequired
  };

  getOptions = mode => {
    const { lang } = this.props;
    switch (mode) {
      case 'parent':
        return {
          icon: <IconFileTree />,
          className: css.parentTask,
          dataTip: localize[lang].PARENT_TASK
        };

      case 'linked':
        return {
          icon: <IconLink />,
          className: css.linkedTask,
          dataTip: localize[lang].LINKED_TASK
        };

      case 'sub':
        return {
          icon: <IconFileTree />,
          className: css.subTask,
          dataTip: localize[lang].SUB_TASK
        };

      default:
        break;
    }
  };

  scrollToTask = () => {
    const {
      task: { id }
    } = this.props;

    scrollTo(`#task-${id}`);
  };

  highlightTaskOnBoard = () => this.props.onHover(this.props.task.id, CARD_IS_FOCUSED);

  removeTaskHighlighting = () => this.props.onHover(null, !CARD_IS_FOCUSED);

  render() {
    const { task, isLighted, mode, prefix, projectId } = this.props;
    const { className, icon, dataTip } = this.getOptions(mode);

    return (
      <div
        onMouseEnter={this.highlightTaskOnBoard}
        onMouseLeave={this.removeTaskHighlighting}
        className={className}
        onClick={this.scrollToTask}
      >
        {isLighted ? <div className={css.lightedBorder} /> : null}
        <div className="ellipsis" title={task.name}>
          <span className={css.shortNumber} data-tip={dataTip}>
            <span className={css.relatedTaskIcon}>{icon}</span>
            {prefix}-{task.id}:
          </span>
          <Link to={`/projects/${projectId}/tasks/${task.id}`} className={css.relatedTaskName}>
            {task.name}
          </Link>
        </div>
      </div>
    );
  }
}

export default componentName;
