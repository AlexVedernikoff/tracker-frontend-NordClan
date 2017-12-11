import React, { Component } from 'react';
import { IconPause, IconPlay, IconList } from '../../../../../components/Icons';
import * as css from '../Playlist.scss';

class ActiveTaskPanel extends Component {
  constructor(props) {
    super(props);
    this.stopStatuses = [3, 5, 7];
    this.playStatuses = [2, 4, 6];
  }

  changeStatus = (event) => {
    const { changeTask, activeTask } = this.props;

    if (!activeTask) {
      return;
    }

    const taskIsActive = ~this.playStatuses.indexOf(activeTask.statusId);
    const taskIsStopped = ~this.stopStatuses.indexOf(activeTask.statusId);

    if (taskIsActive || taskIsStopped) {
      const updatedStatus = taskIsActive
        ? activeTask.statusId + 1
        : activeTask.statusId - 1

      changeTask({ id: activeTask.id, statusId: updatedStatus }, 'Status');
      event.stopPropagation();
    }
  }

  selectIcon() {
    const { activeTask } = this.props
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
    const { activeTask } = this.props

    if (!activeTask) {
      return 'Нет активных задач'
    }

    const taskTitle = `${activeTask.project.prefix}-${activeTask.id}`;

    if (~this.playStatuses.indexOf(activeTask.statusId)) {
      return `Активная задача: ${taskTitle}`
    }

    return `Последняя активная задача: ${taskTitle}`
  }

  render () {
    const { activeTask, className, onClick } = this.props;
    const Icon = this.selectIcon();
    const title = this.getTitle();
    const taskName = activeTask ? activeTask.name : '';

    return <div className={className} onClick={onClick}>
      <div className={css.actionButton} onClick={this.changeStatus}>
        <Icon />
      </div>
      <div className={css.taskNameWrapper}>
        <div className={css.taskTitle}>
          <div className={css.meta}>
            {title}
          </div>
          <div className={css.taskName}>
            {taskName}
          </div>
        </div>
      </div>
    </div>
  }
}

export default ActiveTaskPanel;
