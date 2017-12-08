import React, { Component } from 'react';
import { IconPause, IconPlay, IconList } from '../../../../../components/Icons';
import * as css from '../Playlist.scss';

class ActiveTaskPanel extends Component {
  constructor(props) {
    super(props);
    this.stopStatuses = [3, 5, 7];
    this.playStatuses = [2, 4, 6];
  }

  changeStatus = (e) => {
    const { changeTask, activeTask } = this.props;

    if (!activeTask) {
      return;
    }

    if (~this.playStatuses.indexOf(activeTask.statusId)) {
      changeTask({
        id: activeTask.id,
        statusId: activeTask.statusId + 1
      }, 'Status');
      e.stopPropagation();
    }

    if (~this.stopStatuses.indexOf(activeTask.statusId)) {
      changeTask({
        id: activeTask.id,
        statusId: activeTask.statusId - 1
      }, 'Status');
      e.stopPropagation();
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
        <Icon style={{width: '1.5rem', height: '1.5rem'}}/>
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
