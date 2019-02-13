import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Button from '../../../components/Button';
import ConfirmModal from '../../../components/ConfirmModal';
import { Link } from 'react-router';
import PerformerModal from '../../../components/PerformerModal';
import Priority from '../../../components/Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';
import { getProjectUsers } from '../../../actions/Project';
import { TASK_STATUSES } from '../../../constants/TaskStatuses';
import { connect } from 'react-redux';
import CopyThis from '../../../components/CopyThis';
import { history } from '../../../History';
import getTypeById from '../../../utils/TaskTypes';
import localize from './TaskHeader.json';
import { getFullName } from '../../../utils/NameLocalisation';
import { getLocalizedTaskTypes } from '../../../selectors/dictionaries';
import { createSelector } from 'reselect';
import sortPerformer from '../../../utils/sortPerformer';
import { addActivity } from '../../../actions/Timesheets';
import moment from 'moment';
import shortid from 'shortid';
import { isOnlyDevOps } from '../../../utils/isDevOps';
import { devOpsUsersSelector } from '../../../utils/sortPerformer';
import differenceBy from 'lodash/differenceBy';

const usersSelector = state => state.Project.project.users;

const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));

const getNewStatus = newPhase => {
  let newStatusId;

  switch (newPhase) {
    case 'New':
      newStatusId = TASK_STATUSES.NEW;
      break;
    case 'Develop':
      newStatusId = TASK_STATUSES.DEV_STOP;
      break;
    case 'Code Review':
      newStatusId = TASK_STATUSES.CODE_REVIEW_STOP;
      break;
    case 'QA':
      newStatusId = TASK_STATUSES.QA_STOP;
      break;
    case 'Done':
      newStatusId = TASK_STATUSES.DONE;
      break;
    case 'Closed':
      newStatusId = TASK_STATUSES.CLOSED;
      break;
    default:
      break;
  }

  return newStatusId;
};

class TaskHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCancelModalOpen: false,
      isPerformerModalOpen: false,
      modalTitle: '',
      performer: null,
      clickedStatus: '',
      prevClickedStatus: '',
      isTaskLoaded: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.task.project && nextProps.task.project) {
      this.setState({
        isTaskLoaded: true
      });
    }
  }

  createChangeStatusHandler = (statusStop, statusPlay, statusName) => () => {
    const currentStatus = this.props.task.statusId;
    const statusTransition = {
      [TASK_STATUSES.DEV_STOP]: TASK_STATUSES.DEV_PLAY,
      [TASK_STATUSES.DEV_PLAY]: TASK_STATUSES.DEV_STOP,
      [TASK_STATUSES.CODE_REVIEW_PLAY]: TASK_STATUSES.CODE_REVIEW_STOP,
      [TASK_STATUSES.CODE_REVIEW_STOP]: TASK_STATUSES.CODE_REVIEW_PLAY,
      [TASK_STATUSES.QA_PLAY]: TASK_STATUSES.QA_STOP,
      [TASK_STATUSES.QA_STOP]: TASK_STATUSES.QA_PLAY
    };
    if (currentStatus !== statusStop && currentStatus !== statusPlay) {
      this.changeClickedStatus(statusName);
      return;
    } else {
      this.changeStatus(statusTransition[currentStatus]);
    }
  };

  handleOpenModal = () => {
    this.props.getProjectUsers(this.props.projectId);
    this.props.addActivity({
      id: `temp-${shortid.generate()}`,
      comment: null,
      task: {
        id: this.props.task.id,
        name: this.props.task.name,
        sprint: this.props.task.sprint
      },
      taskStatusId: this.props.task.statusId,
      typeId: this.props.task.typeId,
      spentTime: '0',
      sprintId: this.props.task.sprint && this.props.task.sprint.id,
      sprint: this.props.task.sprint,
      onDate: moment(this.props.startingDay).format('YYYY-MM-DD'),
      project: {
        id: this.props.task.project.id,
        name: this.props.task.project.name,
        prefix: this.props.task.project.prefix
      }
    });
    this.setState({
      performer: this.props.task.performer ? this.props.task.performer.id : null,
      isPerformerModalOpen: true,
      modalTitle: `${localize[this.props.lang].MOVE_TO} ${this.state.clickedStatus}`
    });
  };

  handleCloseModal = () => {
    this.setState(
      prevState => ({
        clickedStatus: prevState.prevClickedStatus
      }),
      this.closePerformerModal
    );
  };

  handleOpenCancelModal = () => {
    this.setState({ isCancelModalOpen: true });
  };

  handleCloseCancelModal = () => {
    this.setState({ isCancelModalOpen: false });
  };

  handleCancelTask = () => {
    this.changeStatus(TASK_STATUSES.CANCELED);
    this.handleCloseCancelModal();
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  changeStatus = newStatusId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        statusId: newStatusId
      },
      'Status'
    );
  };

  changePerformer = performerId => {
    this.props.onChange(
      {
        id: this.props.task.id,
        performerId: performerId,
        statusId: getNewStatus(this.state.clickedStatus)
      },
      'User'
    );

    this.closePerformerModal();
  };

  changeClickedStatus = statusName => {
    this.setState(
      prevState => ({
        clickedStatus: statusName,
        // we save previous clicked status in order to
        // restore it if user decided to not change task status
        // and closed performer modal.
        // And we set prevClickedStatus equal either to the value
        // of clickedStatus in prevState or to the new value 'statusName'
        // if clickedStatus hasn't been set yet.
        prevClickedStatus: prevState.clickedStatus || statusName
      }),
      this.handleOpenModal
    );
  };

  closePerformerModal = () => {
    this.setState({ isPerformerModalOpen: false });
  };

  getButtonType = (inHoldStatusId, inProcessStatusId) => {
    const { task } = this.props;
    let type;
    if (task.statusId === inProcessStatusId) {
      type = 'green';
    } else if (task.statusId === inHoldStatusId) {
      type = 'primary';
    } else {
      type = 'bordered';
    }
    return type;
  };

  getButtonIcon = (inHoldStatusId, inProcessStatusId) => {
    const { task } = this.props;
    let icon = null;
    if (task.statusId === inProcessStatusId) {
      icon = 'IconPause';
    } else if (task.statusId === inHoldStatusId) {
      icon = 'IconPlay';
    }
    return icon;
  };

  getButtonTip = (inHoldStatusId, inProcessStatusId, phase) => {
    const { task, lang } = this.props;
    let tip;
    if (task.statusId === inProcessStatusId) {
      tip = localize[lang].STOP;
    } else if (task.statusId === inHoldStatusId) {
      tip = localize[lang].PLAY;
    } else {
      tip = `${localize[this.props.lang].MOVE_TO} ${phase}`;
    }
    return tip;
  };

  handleChangeSingleStateStatus = (status, statusName) => () => {
    if (statusName && statusName !== 'New' && statusName !== this.state.clickedStatus) {
      this.changeClickedStatus(statusName);
    } else {
      this.changeStatus(status);
    }
  };

  getUsersFullNames = users => {
    return users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? getFullName(item.user) : getFullName(item)
    }));
  };

  render() {
    const { task, taskTypes, canEdit, lang, users, unsortedUsers, devOpsUsers } = this.props;
    const css = require('./TaskHeader.scss');
    let unionPerformers = [];
    switch (this.state.clickedStatus) {
      case 'Develop':
        unionPerformers = _.union(
          task.isDevOps ? devOpsUsers : [],
          task.isDevOps ? users.devops : [],
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 'Code Review':
        unionPerformers = _.union(
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android
        );
        break;
      case 'QA':
        unionPerformers = users.qa;
        break;
      default:
        unionPerformers = _.union(
          task.isDevOps ? devOpsUsers : [],
          task.isDevOps ? users.devops : [],
          users.pm,
          users.teamLead,
          users.account,
          users.analyst,
          users.back,
          users.front,
          users.ux,
          users.mobile,
          users.ios,
          users.android,
          users.qa
        );
    }

    const restUsers = differenceBy(unsortedUsers, unionPerformers, 'id');

    return (
      <div>
        {task.parentTask ? (
          <div className={css.parentTaskWrp}>
            <div className={css.parentTask}>
              <div className={css.prefix} data-tip={localize[lang].PARENT_TASK}>
                {task.project.prefix}-{task.parentTask.id}
              </div>
              <Link to={`/projects/${task.project.id}/tasks/${task.parentTask.id}`} className={css.parentTaskName}>
                {task.parentTask.name}
              </Link>
            </div>
            <div className={css.parentTaskLink}>
              <div className={css.tasksPointers} />
            </div>
          </div>
        ) : null}

        <div className={css.taskTopInfo}>
          <CopyThis
            wrapThisInto={'div'}
            description={`${localize[lang].TASK_LINK} ${task.project ? task.project.prefix + '-' : ''}${task.id}`}
            textToCopy={`${location.origin}${history.createHref(this.props.location)}`}
          >
            {task.project ? (
              <div className={css.prefix}>
                {task.project.prefix}-{task.id}
              </div>
            ) : null}
          </CopyThis>
          {task.typeId && getTypeById(task.typeId, taskTypes) ? (
            <div>
              <span>{getTypeById(task.typeId, taskTypes)}</span>
            </div>
          ) : null}
          {task.prioritiesId ? (
            <Priority taskId={task.id} priority={task.prioritiesId} onChange={this.props.onChange} canEdit={canEdit} />
          ) : null}
        </div>
        <TaskTitle name={task.name} id={task.id} canEdit={canEdit} />
        <div className={css.progressButtons}>
          {!isOnlyDevOps(this.props.user, this.props.project.id) ? (
            <Button
              type={task.statusId === TASK_STATUSES.CANCELED ? 'red' : 'red-bordered'}
              icon="IconClose"
              data-tip={task.statusId === TASK_STATUSES.CANCELED ? null : localize[lang].CANCEL}
              data-place="bottom"
              addedClassNames={{ [css.buttonCancel]: true }}
              onClick={task.statusId !== TASK_STATUSES.CANCELED ? this.handleOpenCancelModal : null}
              disabled={!canEdit || !this.state.isTaskLoaded}
            />
          ) : null}
          <ButtonGroup type="lifecircle" stage="full" key={task.statusId}>
            <Button
              text="New"
              type={task.statusId === TASK_STATUSES.NEW ? 'green' : 'bordered'}
              data-tip={task.statusId === TASK_STATUSES.NEW ? null : localize[lang].MOVE_TO_NEW}
              data-place="bottom"
              onClick={this.handleChangeSingleStateStatus(TASK_STATUSES.NEW, 'New')}
              disabled={!this.state.isTaskLoaded}
            />
            <Button
              text="Develop"
              type={this.getButtonType(TASK_STATUSES.DEV_STOP, TASK_STATUSES.DEV_PLAY)}
              data-tip={this.getButtonTip(TASK_STATUSES.DEV_STOP, TASK_STATUSES.DEV_PLAY, 'Develop')}
              icon={this.getButtonIcon(TASK_STATUSES.DEV_STOP, TASK_STATUSES.DEV_PLAY)}
              onClick={this.createChangeStatusHandler(TASK_STATUSES.DEV_STOP, TASK_STATUSES.DEV_PLAY, 'Develop')}
              data-place="bottom"
              disabled={!canEdit || !this.state.isTaskLoaded}
            />
            <Button
              text="Code Review"
              type={this.getButtonType(TASK_STATUSES.CODE_REVIEW_STOP, TASK_STATUSES.CODE_REVIEW_PLAY)}
              data-tip={this.getButtonTip(
                TASK_STATUSES.CODE_REVIEW_STOP,
                TASK_STATUSES.CODE_REVIEW_PLAY,
                'Code Review'
              )}
              icon={this.getButtonIcon(TASK_STATUSES.CODE_REVIEW_STOP, TASK_STATUSES.CODE_REVIEW_PLAY)}
              onClick={this.createChangeStatusHandler(
                TASK_STATUSES.CODE_REVIEW_STOP,
                TASK_STATUSES.CODE_REVIEW_PLAY,
                'Code Review'
              )}
              data-place="bottom"
              disabled={!canEdit || !this.state.isTaskLoaded}
            />
            <Button
              text="QA"
              type={this.getButtonType(TASK_STATUSES.QA_STOP, TASK_STATUSES.QA_PLAY)}
              data-tip={this.getButtonTip(TASK_STATUSES.QA_STOP, TASK_STATUSES.QA_PLAY, 'QA')}
              icon={this.getButtonIcon(TASK_STATUSES.QA_STOP, TASK_STATUSES.QA_PLAY)}
              onClick={this.createChangeStatusHandler(TASK_STATUSES.QA_STOP, TASK_STATUSES.QA_PLAY, 'QA')}
              data-place="bottom"
              disabled={!canEdit || !this.state.isTaskLoaded}
            />
            <Button
              text="Done"
              type={task.statusId === TASK_STATUSES.DONE ? 'green' : 'bordered'}
              data-tip={task.statusId === TASK_STATUSES.DONE ? null : localize[lang].MOVE_TO_DONE}
              data-place="bottom"
              onClick={this.handleChangeSingleStateStatus(TASK_STATUSES.DONE, 'Done')}
              disabled={!canEdit || !this.state.isTaskLoaded}
            />
          </ButtonGroup>
          <Button
            type={task.statusId === TASK_STATUSES.CLOSED ? 'green' : 'bordered'}
            icon="IconCheck"
            data-tip={task.statusId === TASK_STATUSES.CLOSED ? null : localize[lang].ACCEPT}
            data-place="bottom"
            addedClassNames={{ [css.buttonOk]: true }}
            onClick={this.handleChangeSingleStateStatus(TASK_STATUSES.CLOSED)}
            disabled={!canEdit || !this.state.isTaskLoaded}
          />
        </div>
        <hr />

        {this.state.isCancelModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].CANCEL_MESSAGE}
            onCancel={this.handleCloseCancelModal}
            onConfirm={this.handleCancelTask}
          />
        ) : null}

        {this.state.isPerformerModalOpen ? (
          <PerformerModal
            defaultUser={task.performer ? task.performer.id : null}
            onChoose={this.changePerformer}
            onClose={this.handleCloseModal}
            title={this.state.modalTitle}
            users={this.getUsersFullNames(unionPerformers)}
            restUsers={this.getUsersFullNames(restUsers)}
            id={task.id}
          />
        ) : null}
      </div>
    );
  }
}

TaskHeader.propTypes = {
  addActivity: PropTypes.func,
  canEdit: PropTypes.bool,
  css: PropTypes.object,
  devOpsUsers: PropTypes.array,
  getProjectUsers: PropTypes.func.isRequired,
  lang: PropTypes.string,
  location: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  project: PropTypes.object,
  projectId: PropTypes.string.isRequired,
  startingDay: PropTypes.object,
  task: PropTypes.object.isRequired,
  taskTypes: PropTypes.array,
  unsortedUsers: PropTypes.array,
  user: PropTypes.object,
  users: PropTypes.object
};

const mapStateToProps = state => ({
  users: sortedUsersSelector(state),
  unsortedUsers: usersSelector(state),
  project: state.Project.project,
  user: state.Auth.user,
  devOpsUsers: devOpsUsersSelector(state),
  location: state.routing.locationBeforeTransitions,
  startingDay: state.Timesheets.startingDay,
  task: state.Task.task,
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  addActivity,
  getProjectUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHeader);
