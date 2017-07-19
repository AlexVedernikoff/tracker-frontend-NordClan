import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectDropdown from '../../../components/SelectDropdown';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Priority from '../Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';
import { getProjectUsers } from '../../../actions/Project';
import TaskStatuses from '../../../constants/TaskStatuses';
import { connect } from 'react-redux';

const getNewStatus = (newPhase) => {
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
    default: break;
  }

  return newStatusId;
};

class TaskHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
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
      isModalOpen: true,
      modalTitle: `Перевести в стадию ${this.state.clickedStatus}`
    });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleCancelTask = () => {
    this.changeStatus(9);
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

  changePerformer = () => {
    this.props.onChangeUser(this.props.task.id, this.state.performer, getNewStatus(this.state.clickedStatus));
    this.handleCloseModal();
  }

  render () {
    const { task } = this.props;
    const css = require('./TaskHeader.scss');
    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? item.user.fullNameRu : item.fullNameRu
    }));

    return (
      <div>
        {task.parentId
          ? <div className={css.parentTask}>
              <div className={css.prefix} data-tip="Родительская задача ">
                PPJ-56320
              </div>
              <a href="#" className={css.parentTaskName}>
                UI: Add to gulp build tasks for css and js minification
              </a>
              <div className={css.parentTaskLink}>
                <div className={css.tasksPointers} />
              </div>
            </div>
          : null}

        <div className={css.taskTopInfo}>
          <div className={css.prefix}>
            PPJ-{task.id}
          </div>
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
          onClick={this.handleCancelTask}
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
            type={
                    task.statusId === 2 || task.statusId === 3
                    ? 'green'
                    : 'bordered'
                  }
            data-tip={
                    task.statusId === 2
                    ? 'Приостановить'
                    : task.statusId === 3
                    ? 'Начать'
                    : 'Перевести в стадию Develop'
                  }
            icon= {
              task.statusId === 2
              ? 'IconPause'
              : task.statusId === 3
              ? 'IconPlay'
              : null
            }
            data-place="bottom"
            onClick={this.handleChangeStatus}
          />
          <Button
            text="Code Review"
            type={
                    task.statusId === 4 || task.statusId === 5
                    ? 'green'
                    : 'bordered'
                  }
            data-tip={
                    task.statusId === 4
                    ? 'Приостановить'
                    : task.statusId === 5
                    ? 'Начать'
                    : 'Перевести в стадию Code Review'
                  }
            icon= {
              task.statusId === 4
              ? 'IconPause'
              : task.statusId === 5
              ? 'IconPlay'
              : null
            }
            data-place="bottom"
            onClick={this.handleChangeStatus}
          />
          <Button
            text="QA"
            type={
                    task.statusId === 6 || task.statusId === 7
                    ? 'green'
                    : 'bordered'
                  }
            data-tip={
                    task.statusId === 6
                    ? 'Приостановить'
                    : task.statusId === 7
                    ? 'Начать'
                    : 'Перевести в стадию QA'
                  }
            icon= {
              task.statusId === 6
              ? 'IconPause'
              : task.statusId === 7
              ? 'IconPlay'
              : null
            }
            data-place="bottom"
            onClick={this.handleChangeStatus}
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
        {/*<Button type="bordered" icon='IconCheck' data-tip="Принять" data-place='bottom' addedClassNames={{[css.buttonOk]: true}} />*/}
        <hr />
        {this.state.isModalOpen
          ? <Modal
              isOpen
              contentLabel="modal"
              className={css.modalWrapper}
              onRequestClose={this.handleCloseModal}
            >
              <div className={css.changeStage}>
                <h3>{this.state.modalTitle}</h3>
                <div className={css.modalLine}>
                  <SelectDropdown
                    name="member"
                    placeholder="Введите имя исполнителя..."
                    multi={false}
                    value={this.state.performer}
                    onChange={e => this.selectValue(e !== null ? e.value : 0, 'performer')}
                    noResultsText="Нет результатов"
                    options={users}
                  />
                  <Button type="green" text="ОК" onClick={this.changePerformer}/>
                </div>
              </div>
            </Modal>
          : null}
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
