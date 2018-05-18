import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from '../TaskCard.scss';

import { IconFileTree, IconLink } from '../../Icons';

class componentName extends Component {
  static propTypes = {
    isLighted: PropTypes.bool,
    mode: PropTypes.string,
    onHover: PropTypes.func,
    prefix: PropTypes.string,
    task: PropTypes.object
  };

  getOptions = mode => {
    switch (mode) {
      case 'parent':
        return {
          icon: <IconFileTree />,
          className: css.parentTask,
          dataTip: 'Родительская задача'
        };

      case 'linked':
        return {
          icon: <IconLink />,
          className: css.linkedTask,
          dataTip: 'Связанная задача'
        };

      case 'sub':
        return {
          icon: <IconFileTree />,
          className: css.subTask,
          dataTip: 'Подзадача'
        };

      default:
        break;
    }
  };

  render() {
    const { onHover, task, isLighted, mode, prefix } = this.props;

    const { className, icon, dataTip } = this.getOptions(mode);

    return (
      <div onMouseEnter={() => onHover(task.id, true)} onMouseLeave={() => onHover(null, false)} className={className}>
        {isLighted ? <div className={css.lightedBorder} /> : null}
        <div className="ellipsis" title={task.name}>
          <span className={css.shortNumber} data-tip={dataTip}>
            <span className={css.relatedTaskIcon}>{icon}</span>
            {prefix}-{task.id}:
          </span>
          {task.name}
        </div>
      </div>
    );
  }
}

export default componentName;
