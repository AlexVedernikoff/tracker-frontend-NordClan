import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { IconPause, IconPlay, IconList } from '../../../../../components/Icons';
import localize from './activeTaskPanel.json';
import * as css from '../Playlist.scss';
import { TASK_STATUSES } from '../../../../../constants/TaskStatuses';

const phoneWidth = 768;

class ActiveTaskPanel extends Component {
  static propTypes = {
    activeTask: PropTypes.object,
    changeTask: PropTypes.func,
    className: PropTypes.object,
    lang: PropTypes.string,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.stopStatuses = [3, 5, 7];
    this.playStatuses = [2, 4, 6];

    this.state = {
      maxLength: 150
    };
  }

  componentDidMount() {
    this.onResize();
    addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    const width = window.innerWidth;
    if (width < phoneWidth) {
      this.setState({ maxLength: Math.floor((width - 210) / 4) });
    }
  };

  changeStatus = event => {
    const { changeTask, activeTask } = this.props;

    if (!activeTask) {
      return;
    }

    const statusTransition = {
      [TASK_STATUSES.DEV_STOP]: TASK_STATUSES.DEV_PLAY,
      [TASK_STATUSES.DEV_PLAY]: TASK_STATUSES.DEV_STOP,
      [TASK_STATUSES.CODE_REVIEW_PLAY]: TASK_STATUSES.CODE_REVIEW_STOP,
      [TASK_STATUSES.CODE_REVIEW_STOP]: TASK_STATUSES.CODE_REVIEW_PLAY,
      [TASK_STATUSES.QA_PLAY]: TASK_STATUSES.QA_STOP,
      [TASK_STATUSES.QA_STOP]: TASK_STATUSES.QA_PLAY
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
      return localize[lang].NO_ACTIVE_TASKS;
    }

    const taskTitle = `${activeTask.project.prefix}-${activeTask.id}`;

    if (~this.playStatuses.indexOf(activeTask.statusId)) {
      return `${localize[lang].ACTIVE_TASK}: ${taskTitle}`;
    }

    return `${localize[lang].LAST_ACTIVE_TASK}: ${taskTitle}`;
  }

  render() {
    const { activeTask, className, onClick } = this.props;
    const { maxLength } = this.state;
    const Icon = this.selectIcon();
    const title = this.getTitle();
    const taskName = activeTask ? activeTask.name : '';
    const trimTaskName = taskName.length > maxLength ? taskName.slice(0, maxLength - 3) + '...' : taskName;

    return (
      <div className={className} onClick={onClick}>
        <div className={css.actionButton} onClick={this.changeStatus}>
          <Icon />
        </div>
        <div className={classnames(css.taskNameWrapper, css.title)}>
          <div className={css.taskTitle}>
            <div className={css.meta}>{title}</div>
            <div className={css.taskName}>{trimTaskName}</div>
          </div>
        </div>
      </div>
    );
  }
}

ActiveTaskPanel.propTypes = {
  activeTask: PropTypes.object,
  changeTask: PropTypes.func,
  className: PropTypes.string,
  lang: PropTypes.string,
  onClick: PropTypes.func
};

export default ActiveTaskPanel;
