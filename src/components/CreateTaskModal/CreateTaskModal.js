import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import { connect } from 'react-redux';
import Select from 'react-select';
import { stateToHTML } from 'draft-js-export-html';
import { Col, Row } from 'react-flexbox-grid';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';
import ValidatedInput from '../ValidatedInput';
import InputNumber from '../../components/InputNumber';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import * as css from './CreateTaskModal.scss';
import Priority from '../Priority';
import { closeCreateTaskModal, createTask } from '../../actions/Project';
import { BACKLOG_ID } from '../../constants/Sprint';
import Validator from '../ValidatedInput/Validator';
import TextEditor from '../../components/TextEditor';
import Checkbox from '../../components/Checkbox/Checkbox';
import Tag from '../../components/Tag';
import Tags from '../../components/Tags';

class CreateTaskModal extends Component {
  constructor(props) {
    super(props);

    this.types = props.taskTypes.map(({ name, id }) => ({
      label: name,
      value: id
    }));

    this.state = {
      selectedSprint: props.selectedSprintValue,
      selectedPerformer: props.defaultPerformerId || null,
      taskName: '',
      description: '',
      plannedExecutionTime: 0,
      openTaskPage: false,
      prioritiesId: 3,
      selectedType: this.types[0],
      selectedTypeError: this.types.length === 0,
      typeList: this.types,
      isTaskByClient: false,
      tags: []
    };

    this.validator = new Validator();
  }

  handleModalSprintChange = selectedSprint => {
    this.setState({
      selectedSprint: selectedSprint ? selectedSprint.value : 0
    });
  };

  handlePerformerChange = selectedPerformer => {
    this.setState({
      selectedPerformer: selectedPerformer ? selectedPerformer.value : 0
    });
  };

  handleIsTaskByClientChange = () => {
    this.setState({
      isTaskByClient: true
    });
  };

  handlePriorityChange = priorityId => this.setState({ prioritiesId: +priorityId });

  submitTaskAndOpen = () => this.setState({ openTaskPage: true }, () => this.submitTask());

  submitTask = event => {
    if (event) {
      event.preventDefault();
    }
    if (!this.state.selectedType || !this.state.selectedType.value) {
      return;
    }
    this.props.createTask(
      {
        name: this.state.taskName,
        projectId: this.props.project.id,
        description: stateToHTML(this.TextEditor.state.editorState.getCurrentContent()),
        performerId: this.state.selectedPerformer,
        statusId: 1,
        typeId: this.state.selectedType.value,
        sprintId: this.state.selectedSprint === BACKLOG_ID ? null : this.state.selectedSprint,
        prioritiesId: this.state.prioritiesId,
        plannedExecutionTime: this.state.plannedExecutionTime,
        parentId: this.props.parentTaskId,
        isTaskByClient: this.state.isTaskByClient,
        tags: this.state.tags.join(',')
      },
      this.state.openTaskPage,
      this.props.column
    );
  };

  onTypeChange = value => this.setState({ selectedType: value ? value : this.state.typeList[0] });

  getSprints = () => {
    let sprints = _.sortBy(this.props.project.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${
        sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}` : '- ...'
      })`,
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

  handleChange = field => event => {
    this.setState({ [field]: event.target.value.trim() });
  };

  handleChangePlannedTime = plannedExecutionTime => {
    this.setState({ plannedExecutionTime });
  };

  addTag = tag => {
    const unicTags = [...new Set([...this.state.tags, tag])];
    this.setState({ tags: [...unicTags] });
  };
  deleteTag = () => tagName => {
    const tags = this.state.tags.filter(tag => tag !== tagName);
    this.setState({ tags: [...tags] });
  };

  render() {
    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };
    const tags = this.state.tags.map((tagName, i) => {
      return <Tag key={i} name={tagName} noRequest deleteTagModal={() => this.deleteTag()(tagName)} />;
    });
    return (
      <Modal
        isOpen={this.props.isCreateTaskModalOpen || this.props.isCreateChildTaskModalOpen}
        onRequestClose={this.props.closeCreateTaskModal}
        contentLabel="Modal"
      >
        <form className={css.createTaskForm}>
          <h3>Создать задачу</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Название задачи:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      maxRows={5}
                      autoFocus
                      name="taskName"
                      placeholder="Введите название задачи"
                      onChange={this.handleChange('taskName')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText="Длина менее 4 символов"
                    />
                  ),
                  'taskName',
                  this.state.taskName.length < 4
                )}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Описание:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <TextEditor
                  toolbarHidden
                  placeholder="Введите описание задачи"
                  wrapperClassName={css.taskDescriptionWrapper}
                  editorClassName={css.taskDescription}
                  ref={ref => (this.TextEditor = ref)}
                  content={''}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Тэги:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Tags taggable="task" noRequest create canEdit createTagsModalTask={this.addTag}>
                  {tags}
                </Tags>
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Тип задачи:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  multi={false}
                  ignoreCase
                  placeholder="Выберите тип"
                  options={this.state.typeList}
                  className={css.selectSprint}
                  value={this.state.selectedType}
                  onChange={this.onTypeChange}
                  noResultsText="Нет результатов"
                />
                {this.state.selectedTypeError && <span>Ошибка получения данных</span>}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>От клиента:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Checkbox checked={this.state.isTaskByClient} onChange={this.handleIsTaskByClientChange} />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Приоритет:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Priority priority={this.state.prioritiesId} onPrioritySet={this.handlePriorityChange} text={''} />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Исполнитель:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectDropdown
                  name="performer"
                  placeholder="Введите имя исполнителя"
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
                <p>Спринт:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
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
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Оценка времени:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <InputNumber
                  min={0}
                  postfix={'ч.'}
                  onChange={this.handleChangePlannedTime}
                  value={this.state.plannedExecutionTime}
                />
              </Col>
            </Row>
          </label>
          <div className={css.buttonsContainer}>
            <Button
              text="Создать задачу"
              type="green"
              htmlType="submit"
              disabled={
                this.props.isCreateTaskRequestInProgress || (this.validator.isDisabled && !this.state.selectedTypeError)
              }
              onClick={this.submitTask}
              loading={this.props.isCreateTaskRequestInProgress}
            />
            <Button
              text="Создать и открыть"
              htmlType="button"
              type="green-lighten"
              disabled={
                this.props.isCreateTaskRequestInProgress || (this.validator.isDisabled && !this.state.selectedTypeError)
              }
              onClick={this.submitTaskAndOpen}
              loading={this.props.isCreateTaskRequestInProgress}
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
  isCreateChildTaskModalOpen: PropTypes.bool,
  isCreateTaskModalOpen: PropTypes.bool,
  isCreateTaskRequestInProgress: PropTypes.bool,
  parentTaskId: PropTypes.number,
  project: PropTypes.object,
  selectedSprintValue: PropTypes.number,
  taskTypes: PropTypes.array,
  defaultPerformerId: PropTypes.number
};

const mapStateToProps = state => ({
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  isCreateChildTaskModalOpen: state.Project.isCreateChildTaskModalOpen,
  taskTypes: state.Dictionaries.taskTypes,
  isCreateTaskRequestInProgress: state.Project.isCreateTaskRequestInProgress
});

const mapDispatchToProps = {
  closeCreateTaskModal,
  createTask
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskModal);
