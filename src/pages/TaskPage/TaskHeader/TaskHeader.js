import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../../components/Button';
import ConfirmModal from '../../../components/ConfirmModal';
import { Link } from 'react-router';
import PerformerModal from '../../../components/PerformerModal';
import Priority from '../Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';
import { getProjectUsers } from '../../../actions/Project';
import TaskStatuses from '../../../constants/TaskStatuses';
import { connect } from 'react-redux';

const getNewStatus = newPhase => {
  let newStatusId;

  switch (newPhase) {
  case 'New': newStatusId = 1;
    break;
  case 'Develop': newStatusId = 3;
    break;
  case 'Code Review': newStatusId = 5;
    break;
  case 'QA': newStatusId = 7;
    break;
  case 'Done': newStatusId = 8;
    break;
  case 'Closed': newStatusId = 10;
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
  }

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
    this.changeStatus(9);
    this.handleCloseCancelModal();
  }

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
  }

  changePerformer = (performerId) => {
    this.props.onChangeUser(this.props.task.id, performerId, getNewStatus(this.state.clickedStatus));
    this.handleCloseModal();
  }

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
  }

  getButtonIcon = (inProcessStatusId, inHoldStatusId) => {
    const { task } = this.props;
    let icon = null;
    if (task.statusId === inProcessStatusId) {
      icon = 'IconPause';
    } else if (task.statusId === inHoldStatusId) {
      icon = 'IconPlay';
    }
    return icon;
  }

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
  }

  handleClose = () => {
    this.props.onChangeUser(this.props.task.id, 0, 10);
  };

  render () {
    const { task } = this.props;
    const css = require('./TaskHeader.scss');
    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? item.user.fullNameRu : item.fullNameRu
    }));
    return (
      <div>
        {
          task.parentTask
          ? <div className={css.parentTask}>
              <div className={css.prefix} data-tip="Родительская задача ">
                {task.project.prefix}-{task.parentTask.id}
              </div>
               <Link to={`/projects/${task.project.id}/tasks/${task.parentTask.id}`} className={css.parentTaskName}>
                  {task.parentTask.name}
                </Link>
              <div className={css.parentTaskLink}>
                <div className={css.tasksPointers} />
              </div>
            </div>
          : null
        }

        <div className={css.taskTopInfo}>
          {task.project
            ? <div className={css.prefix}>
                {task.project.prefix}-{task.id}
              </div>
            : null
          }
          {task.typeId && TaskStatuses[task.typeId]
            ? <div>
                <span>
                  {TaskStatuses[task.typeId]}
                </span>
              </div>
            : null}
          {task.prioritiesId
            ? <Priority taskId={task.id} priority={task.prioritiesId} onChange={this.props.onChange} />
            : null}
        </div>
        <TaskTitle name={task.name} id={task.id} />
        <Button
          type="bordered"
          icon="IconClose"
          data-tip="Отменить"
          data-place="bottom"
          addedClassNames={{ [css.buttonCancel]: true }}
          onClick={this.handleOpenCancelModal}
        />
        <ButtonGroup type="lifecircle" stage="full">
          <Button
            text="New"
            type={
                    task.statusId === 1
                    ? 'green'
                    : 'bordered'
                  }
            data-tip={
                    task.statusId === 1
                    ? null
                    : 'Перевести в стадию New'
                  }
            data-place="bottom"
            onClick={this.handleChangeStatus}
          />
          <Button
            text="Develop"
            type={this.getButtonType(2, 3)}
            data-tip={this.getButtonTip(2, 3, 'Develop')}
            icon= {this.getButtonIcon(2, 3)}
            onClick={this.handleChangeStatus}
            data-place="bottom"
          />
          <Button
            text="Code Review"
            type={this.getButtonType(4, 5)}
            data-tip={this.getButtonTip(4, 5, 'Code Review')}
            icon= {this.getButtonIcon(4, 5)}
            onClick={this.handleChangeStatus}
            data-place="bottom"
          />
          <Button
            text="QA"
            type={this.getButtonType(6, 7)}
            data-tip={this.getButtonTip(6, 7, 'QA')}
            icon= {this.getButtonIcon(6, 7)}
            onClick={this.handleChangeStatus}
            data-place="bottom"
          />
          <Button
            text="Done"
            type={
                    task.statusId === 8
                    ? 'green'
                    : 'bordered'
                  }
            data-tip={
                    task.statusId === 8
                    ? null
                    : 'Перевести в стадию Done'
                  }
            data-place="bottom"
            onClick={this.handleChangeStatus}
          />
        </ButtonGroup>
        <Button
          type={
            task.statusId === 10
              ? 'green'
              : 'bordered'
          }
          icon="IconCheck"
          data-tip={
            task.statusId === 10
              ? null
              : 'Принять'
          }
          data-place="bottom"
          addedClassNames={{[css.buttonOk]: true}}
          onClick={this.handleClose}
        />
        <hr />

        { this.state.isCancelModalOpen
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
  onChange: PropTypes.func.isRequired,
  onChangeUser: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  users: state.Project.project.users
});

const mapDispatchToProps = {
  getProjectUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskHeader);
