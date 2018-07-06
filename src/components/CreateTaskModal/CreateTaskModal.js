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
import localize from './CreateTaskModal.json';

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
      isTaskByClient: false
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
        isTaskByClient: this.state.isTaskByClient
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

  render() {
    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    const { lang } = this.props;

    return (
      <Modal
        isOpen={this.props.isCreateTaskModalOpen || this.props.isCreateChildTaskModalOpen}
        onRequestClose={this.props.closeCreateTaskModal}
        contentLabel="Modal"
      >
        <form className={css.createTaskForm}>
          <h3>{localize[lang].CREATE_TASK}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].NAME}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      maxRows={5}
                      autoFocus
                      name="taskName"
                      placeholder={localize[lang].NAME_PLACEHOLDER}
                      onChange={this.handleChange('taskName')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={localize[lang].NAME_ERROR}
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
                <p>{localize[lang].DESCRIPTION}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <TextEditor
                  toolbarHidden
                  placeholder={localize[lang].PLACEHOLDER_DESCRIPTION}
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
                <p>{localize[lang].TYPE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  multi={false}
                  ignoreCase
                  placeholder={localize[lang].TYPE_PLACEHOLDER}
                  options={this.state.typeList}
                  className={css.selectSprint}
                  value={this.state.selectedType}
                  onChange={this.onTypeChange}
                  noResultsText={localize[lang].NO_RESULTS}
                />
                {this.state.selectedTypeError && <span>{localize[lang].GET_DATA_ERROR}</span>}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].FROM_CLIENT}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Checkbox checked={this.state.isTaskByClient} onChange={this.handleIsTaskByClientChange} />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].PRIORITY}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Priority priority={this.state.prioritiesId} onPrioritySet={this.handlePriorityChange} text={''} />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].PERFORMER}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectDropdown
                  name="performer"
                  placeholder={localize[lang].PERFORMER_PLACEHOLDER}
                  multi={false}
                  className={css.selectPerformer}
                  value={this.state.selectedPerformer}
                  onChange={this.handlePerformerChange}
                  noResultsText={localize[lang].NO_RESULTS}
                  options={this.getUsers()}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].SPRINT}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  promptTextCreator={label => `${localize[lang].CREATE_SPRINT} '${label}'`}
                  searchPromptText={localize[lang].NAME_SPRINT}
                  multi={false}
                  ignoreCase
                  placeholder={localize[lang].SELECT_SPRINT}
                  options={this.getSprints()}
                  className={css.selectSprint}
                  onChange={this.handleModalSprintChange}
                  value={this.state.selectedSprint}
                  noResultsText={localize[lang].NO_RESULTS}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].TIMING}</p>
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
              text={localize[lang].CREATE_TASK}
              type="green"
              htmlType="submit"
              disabled={
                this.props.isCreateTaskRequestInProgress || (this.validator.isDisabled && !this.state.selectedTypeError)
              }
              onClick={this.submitTask}
              loading={this.props.isCreateTaskRequestInProgress}
            />
            <Button
              text={localize[lang].CREATE_AND_OPEN}
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
  isCreateTaskRequestInProgress: state.Project.isCreateTaskRequestInProgress,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  closeCreateTaskModal,
  createTask
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTaskModal);
