import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Col, Row } from 'react-flexbox-grid';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import Input from '../Input';
import Button from '../Button';
import TextArea from '../TextArea';
import SelectDropdown from '../SelectDropdown';
import * as css from './CreateTaskModal.scss';
import Priority from '../../pages/TaskPage/Priority';
import { closeCreateTaskModal, createTask } from '../../actions/Project';
import { BACKLOG_ID } from '../../constants/Sprint';

class CreateTaskModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedSprint: null,
      selectedPerformer: null,
      taskName: null,
      description: null,
      openTaskPage: false,
      prioritiesId: 3,
      selectedType: {}
    };
  }

  componentWillReceiveProps (nextProps) {
    const selectedSprint
      = this.state.selectedSprint !== nextProps.selectedSprintValue
        ? nextProps.selectedSprintValue
        : this.state.selectedSprint;

    this.setState(state => {
      return {
        ...state,
        selectedSprint,
        selectedPerformer: null,
        taskName: null,
        description: null,
        openTaskPage: false,
        prioritiesId: 3,
        selectedType: {}
      };
    });
  }

  componentWillUnmount () {
    this.setState({
      selectedSprint: null,
      selectedPerformer: null,
      sprints: null,
      taskName: null,
      description: null,
      openTaskPage: false
    });
  }

  handleModalSprintChange = selectedSprint => {
    this.setState({
      selectedSprint: selectedSprint !== null ? selectedSprint.value : 0
    });
  };

  handlePerformerChange = selectedPerformer => {
    this.setState({
      selectedPerformer:
        selectedPerformer !== null ? selectedPerformer.value : 0
    });
  };

  handleInput = event => {
    this.setState({
      taskName: event.target.value
    });
  };

  handleDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  handlePriorityChange = priorityId => {
    this.setState({
      prioritiesId: +priorityId
    });
  };

  submitTask = event => {
    if (event) {
      event.preventDefault();
    }
    this.props.createTask(
      {
        name: this.state.taskName,
        projectId: this.props.project.id,
        description: this.state.description,
        performerId: this.state.selectedPerformer,
        statusId: 1,
        typeId: this.state.selectedType.value,
        sprintId:
          this.state.selectedSprint === BACKLOG_ID
            ? null
            : this.state.selectedSprint,
        prioritiesId: this.state.prioritiesId,
        parentId: this.props.parentTaskId
      },
      this.state.openTaskPage,
      this.props.column
    );
  };

  submitTaskAndOpen = () => {
    this.setState({ openTaskPage: true }, () => this.submitTask());
  };

  onTypeChange = value => {
    this.setState({
      selectedType: value
    });
  };

  handleCloseModal = event => {
    event.preventDefault();
    this.props.closeCreateTaskModal();
  };

  getSprints = () => {
    let sprints = _.sortBy(this.props.project.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format(
        'DD.MM.YYYY'
      )} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 2,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 1
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: false,
        [css.sprintMarker]: true
      })
    });
    return sprints;
  };

  getUsers = () => {
    return this.props.project.users.map(user => ({
      value: user.id,
      label: user.fullNameRu
    }));
  };

  render () {
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    const types = this.props.taskTypes.map(({ name, id }) => ({
      label: name,
      value: id
    }));

    return (
      <Modal
        isOpen={this.props.isCreateTaskModalOpen}
        onRequestClose={this.props.closeCreateTaskModal}
        contentLabel="Modal"
      >
        <form className={css.createTaskForm}>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Название задачи:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <Input
                  autoFocus
                  onChange={this.handleInput}
                  name="taskName"
                  placeholder="Название задачи"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Описание:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <TextArea
                  onChange={this.handleDescription}
                  name="description"
                  placeholder="Описание задачи"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Тип задачи:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <Select
                  multi={false}
                  ignoreCase
                  placeholder="Выберите тип"
                  options={types}
                  className={css.selectSprint}
                  value={this.state.selectedType}
                  onChange={this.onTypeChange}
                  noResultsText="Нет результатов"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Приоритет:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <Priority
                  priority={this.state.prioritiesId}
                  onPrioritySet={this.handlePriorityChange}
                  text={''}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Исполнитель:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <SelectDropdown
                  name="performer"
                  placeholder="Введите имя исполнителя..."
                  multi={false}
                  className={css.selectPerformer}
                  value={this.state.selectedPerformer}
                  onChange={this.handlePerformerChange}
                  noResultsText="Нет результатов"
                  options={this.getUsers()}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Добавить задачу в спринт:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <Select
                  promptTextCreator={label => `Создать спринт '${label}'`}
                  searchPromptText={'Введите название спринта'}
                  multi={false}
                  ignoreCase
                  placeholder="Выберите спринт"
                  options={this.getSprints()}
                  className={css.selectSprint}
                  onChange={this.handleModalSprintChange}
                  value={this.state.selectedSprint}
                  noResultsText="Нет результатов"
                />
              </Col>
            </Row>
          </label>
          <div className={css.buttonsContainer}>
            <Button
              text="Создать задачу"
              type="green"
              htmlType="submit"
              onClick={this.submitTask}
            />
            <Button
              text="Создать и открыть"
              htmlType="button"
              type="green-lighten"
              onClick={this.submitTaskAndOpen}
            />
          </div>
        </form>
      </Modal>
    );
  }
}

CreateTaskModal.propTypes = {
  closeCreateTaskModal: PropTypes.func.isRequired,
  column: PropTypes.string,
  createTask: PropTypes.func.isRequired,
  isCreateTaskModalOpen: PropTypes.bool.isRequired,
  parentTaskId: PropTypes.number,
  project: PropTypes.object,
  selectedSprintValue: PropTypes.number,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  taskTypes: state.Dictionaries.taskTypes
});

const mapDispatchToProps = {
  closeCreateTaskModal,
  createTask
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskModal);
