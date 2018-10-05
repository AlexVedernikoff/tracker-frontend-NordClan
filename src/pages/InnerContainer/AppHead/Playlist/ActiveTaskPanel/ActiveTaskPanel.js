import React, { Component } from 'react';
import { IconPause, IconPlay, IconList } from '../../../../../components/Icons';
import classnames from 'classnames';
import localization from './activeTaskPanel.json';
import * as css from '../Playlist.scss';

class ActiveTaskPanel extends Component {
  constructor(props) {
    super(props);
    this.stopStatuses = [3, 5, 7];
    this.playStatuses = [2, 4, 6];
  }

  changeStatus = event => {
    const { changeTask, activeTask } = this.props;

    if (!activeTask) {
      return;
    }

    const statusTransition = {
      3: 2,
      2: 3,
      5: 4,
      4: 5,
      7: 6,
      6: 7
    };

    const updatedStatus = statusTransition[activeTask.statusId];
    if (updatedStatus) {
      changeTask({ id: activeTask.id, statusId: updatedStatus }, 'Status');
      event.stopPropagation();
    }
  };

  selectIcon() {
    const { activeTask } = this.props;
    const status = activeTask ? activeTask.statusId : 1;

    if (~this.playStatuses.indexOf(status)) {
      return IconPause;
    }

    if (~this.stopStatuses.indexOf(status)) {
      return IconPlay;
    }

    return IconList;
  }

  getTitle() {
    const { activeTask, lang } = this.props;

    if (!activeTask) {
      return localization[lang].NO_ACTIVE_TASKS;
    }

    const taskTitle = `${activeTask.project.prefix}-${activeTask.id}`;

    if (~this.playStatuses.indexOf(activeTask.statusId)) {
      return `${localization[lang].ACTIVE_TASKS}: ${taskTitle}`;
    }

    return `${localization[lang].LAST_ACTIVE_TASKS}: ${taskTitle}`;
  }

  render() {
    const { activeTask, className, onClick } = this.props;
    const Icon = this.selectIcon();
    const title = this.getTitle();
    const taskName = activeTask ? activeTask.name : '';

    return (
      <div className={className} onClick={onClick}>
        <div className={css.actionButton} onClick={this.changeStatus}>
          <Icon />
        </div>
        <div className={classnames(css.taskNameWrapper, css.title)}>
          <div className={css.taskTitle}>
            <div className={css.meta}>{title}</div>
            <div className={css.taskName}>{taskName}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveTaskPanel;
