import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import ConfirmModal from '../../../components/ConfirmModal';
import { Link } from 'react-router';
import PerformerModal from '../../../components/PerformerModal';
import Priority from '../../../components/Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';
import { getProjectUsers, openCreateTaskModal } from '../../../actions/Project';
import * as TaskStatuses from '../../../constants/TaskStatuses';
import { VISOR } from '../../../constants/Roles';
import { connect } from 'react-redux';
import CopyThis from '../../../components/CopyThis';
import { history } from '../../../History';
import getTypeById from '../../../utils/TaskTypes';

const getNewStatus = newPhase => {
  let newStatusId;

  switch (newPhase) {
  case 'New': newStatusId = TaskStatuses.NEW;
    break;
  case 'Develop': newStatusId = TaskStatuses.DEV_PLAY;
    break;
  case 'Code Review': newStatusId = TaskStatuses.CODE_REVIEW_PLAY;
    break;
  case 'QA': newStatusId = TaskStatuses.QA_PLAY;
    break;
  case 'Done': newStatusId = TaskStatuses.DONE;
    break;
  case 'Closed': newStatusId = TaskStatuses.CLOSED;
    break;
  default: break;
  }

  return newStatusId;
};

class TaskHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCancelModalOpen: false,
      isPerformerModalOpen: false,
      modalTitle: '',
      performer: null,
      clickedStatus: ''
    };
  }

  handleChangeStatus = e => {
    const tip = e.currentTarget.getAttribute('data-tip');
    if (tip === 'Начать') {
      this.changeStatus(this.props.task.statusId - 1);
    } else if (tip === 'Приостановить') {
      this.changeStatus(this.props.task.statusId + 1);
    } else {
      this.state.clickedStatus = e.currentTarget.textContent;
      this.handleOpenModal();
    }
  };

  handleOpenModal = () => {
    this.props.getProjectUsers(this.props.projectId);
    this.setState({
      performer: this.props.task.performer ? this.props.task.performer.id : null,
      isPerformerModalOpen: true,
      modalTitle: `Перевести в стадию ${this.state.clickedStatus}`
    });
  };

  handleCloseModal = () => {
    this.setState({ isPerformerModalOpen: false });
  };

  handleOpenCancelModal = () => {
    this.setState({ isCancelModalOpen: true });
  };

  handleCloseCancelModal = () => {
    this.setState({ isCancelModalOpen: false });
  };

  handleCancelTask = () => {
    this.changeStatus(TaskStatuses.CANCELED);
    this.handleCloseCancelModal();
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  changeStatus = (newStatusId) => {
    this.props.onChange(
      {
        id: this.props.task.id,
        statusId: newStatusId
      },
      'Status'
    );
  };

  changePerformer = (performerId) => {
    this.props.onChange(
      {
        id: this.props.task.id,
        performerId: performerId,
        statusId: getNewStatus(this.state.clickedStatus)
      },
      'User'
    );
    this.handleCloseModal();
  };

  getButtonType = (inProcessStatusId, inHoldStatusId) => {
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

  getButtonIcon = (inProcessStatusId, inHoldStatusId) => {
    const { task } = this.props;
    let icon = null;
    if (task.statusId === inProcessStatusId) {
      icon = 'IconPause';
    } else if (task.statusId === inHoldStatusId) {
      icon = 'IconPlay';
    }
    return icon;
  };

  getButtonTip = (inProcessStatusId, inHoldStatusId, phase) => {
    const { task } = this.props;
    let tip;
    if (task.statusId === inProcessStatusId) {
      tip = 'Приостановить';
    } else if (task.statusId === inHoldStatusId) {
      tip = 'Начать';
    } else {
      tip = `Перевести в стадию ${phase}`;
    }
    return tip;
  };

  handleClose = () => {
    this.props.onChange(
      {
        id: this.props.task.id,
        statusId: TaskStatuses.CLOSED
      },
      'User'
    );
  };

  render () {
    const { task, taskTypes, globalRole } = this.props;
    const css = require('./TaskHeader.scss');
    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? item.user.fullNameRu : item.fullNameRu
    }));

    const isVisor = globalRole === VISOR;

    return (
      <div>
        {
          !isVisor
            ? <Button
              onClick={this.props.openCreateTaskModal}
              type="primary"
              text="Создать задачу"
              icon="IconPlus"
              name="right"
              addedClassNames={{[css.btnAddTask]: true}}
            />
            : null
        }
        {
          task.parentTask
            ? <div className={css.parentTaskWrp}>
                <div className={css.parentTask}>
                <div className={css.prefix} data-tip="Родительская задача ">
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
            : null
        }

        <div className={css.taskTopInfo}>
          <CopyThis
            wrapThisInto={'div'}
            description={`Ссылка на задачу ${task.project ? task.project.prefix + '-' : ''}${task.id}`}
            textToCopy={`${location.origin}${history.createHref(this.props.location)}`}>
            {
              task.project
                ? <div className={css.prefix}>
                  {task.project.prefix}-{task.id}
                </div>
                : null
            }
          </CopyThis>
          {
            task.typeId && getTypeById(task.typeId, taskTypes)
              ? <div>
                <span>
                  {getTypeById(task.typeId, taskTypes)}
                </span>
              </div>
              : null
          }
          {
            task.prioritiesId
              ? <Priority taskId={task.id} priority={task.prioritiesId} onChange={this.props.onChange} />
              : null
          }
        </div>
        <TaskTitle name={task.name} id={task.id} />
        <div className={css.progressButtons}>
          <Button
            type={
              task.statusId === TaskStatuses.CANCELED
                ? 'red'
                : 'red-bordered'
            }
            icon="IconClose"
            data-tip={
              task.statusId === TaskStatuses.CANCELED
                ? null
                : 'Отменить'
            }
            data-place="bottom"
            addedClassNames={{ [css.buttonCancel]: true }}
            onClick={
              task.statusId !== TaskStatuses.CANCELED
                ? this.handleOpenCancelModal
                : null
            }
          />
          <ButtonGroup type="lifecircle" stage="full">
            <Button
              text="New"
              type={
                task.statusId === TaskStatuses.NEW
                  ? 'green'
                  : 'bordered'
              }
              data-tip={
                task.statusId === TaskStatuses.NEW
                  ? null
                  : 'Перевести в стадию New'
              }
              data-place="bottom"
              onClick={this.handleChangeStatus}
            />
            <Button
              text="Develop"
              type={this.getButtonType(TaskStatuses.DEV_STOP, TaskStatuses.DEV_PLAY)}
              data-tip={this.getButtonTip(TaskStatuses.DEV_STOP, TaskStatuses.DEV_PLAY, 'Develop')}
              icon= {this.getButtonIcon(TaskStatuses.DEV_STOP, TaskStatuses.DEV_PLAY)}
              onClick={this.handleChangeStatus}
              data-place="bottom"
            />
            <Button
              text="Code Review"
              type={this.getButtonType(TaskStatuses.CODE_REVIEW_STOP, TaskStatuses.CODE_REVIEW_PLAY)}
              data-tip={this.getButtonTip(TaskStatuses.CODE_REVIEW_STOP, TaskStatuses.CODE_REVIEW_PLAY, 'Code Review')}
              icon= {this.getButtonIcon(TaskStatuses.CODE_REVIEW_STOP, TaskStatuses.CODE_REVIEW_PLAY)}
              onClick={this.handleChangeStatus}
              data-place="bottom"
            />
            <Button
              text="QA"
              type={this.getButtonType(TaskStatuses.QA_STOP, TaskStatuses.QA_PLAY)}
              data-tip={this.getButtonTip(TaskStatuses.QA_STOP, TaskStatuses.QA_PLAY, 'QA')}
              icon= {this.getButtonIcon(TaskStatuses.QA_STOP, TaskStatuses.QA_PLAY)}
              onClick={this.handleChangeStatus}
              data-place="bottom"
            />
            <Button
              text="Done"
              type={
                task.statusId === TaskStatuses.DONE
                  ? 'green'
                  : 'bordered'
              }
              data-tip={
                task.statusId === TaskStatuses.DONE
                  ? null
                  : 'Перевести в стадию Done'
              }
              data-place="bottom"
              onClick={this.handleChangeStatus}
            />
          </ButtonGroup>
          <Button
            type={
              task.statusId === TaskStatuses.CLOSED
                ? 'green'
                : 'bordered'
            }
            icon="IconCheck"
            data-tip={
              task.statusId === TaskStatuses.CLOSED
                ? null
                : 'Принять'
            }
            data-place="bottom"
            addedClassNames={{[css.buttonOk]: true}}
            onClick={this.handleClose}
          />
        </div>
        <hr />

        {
          this.state.isCancelModalOpen
            ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите отменить задачу?"
              onCancel={this.handleCloseCancelModal}
              onConfirm={this.handleCancelTask}
            />
            : null
        }

        {
          this.state.isPerformerModalOpen
            ? <PerformerModal
              defaultUser={task.performer ? task.performer.id : null}
              onChoose={this.changePerformer}
              onClose={this.handleCloseModal}
              title={this.state.modalTitle}
              users={users}
            />
            : null
        }
      </div>
    );
  }
}

TaskHeader.propTypes = {
  css: PropTypes.object,
  getProjectUsers: PropTypes.func.isRequired,
  globalRole: PropTypes.string.isRequired,
  location: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  openCreateTaskModal: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  taskTypes: PropTypes.array,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  users: state.Project.project.users,
  location: state.routing.locationBeforeTransitions,
  taskTypes: state.Dictionaries.taskTypes,
  globalRole: state.Auth.user.globalRole
});

const mapDispatchToProps = {
  getProjectUsers,
  openCreateTaskModal
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskHeader);
