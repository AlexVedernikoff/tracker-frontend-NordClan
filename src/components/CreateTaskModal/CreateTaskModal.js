import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import { stateToHTML } from 'draft-js-export-html';
import { Col, Row } from 'react-flexbox-grid';
import moment from 'moment';
import classnames from 'classnames';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import Modal from '../../components/Modal';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';
import InputNumber from '../../components/InputNumber';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import * as css from './CreateTaskModal.scss';
import Priority from '../Priority';
import { closeCreateTaskModal, createTask } from '../../actions/Project';
import { BACKLOG_ID } from '../../constants/Sprint';
import { IN_PROGRESS } from '../../constants/SprintStatuses';
import Validator from '../ValidatedInput/Validator';
import TextEditor from '../../components/TextEditor';
import Checkbox from '../../components/Checkbox/Checkbox';
import localize from './CreateTaskModal.json';
import { createTags } from '../../actions/Tags';
import Tag from '../../components/Tag';
import Tags from '../../components/Tags';
import { getFullName } from '../../utils/NameLocalisation';
import { getLocalizedTaskTypes } from '../../selectors/dictionaries';
import { If } from '../../utils/jsx';
import uniqWith from 'lodash/uniqWith';
import { removeNumChars } from '../../utils/formatter';
import GoalSelector from '../GoalSelector';

const MAX_DESCRIPTION_LENGTH = 25000;

class CreateTaskModal extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);

    this.validator = new Validator();
  }

  getInitialState = props => ({
    selectedSprint: this.getInitialSprint(props),
    selectedPerformer: props.defaultPerformerId || null,
    goalId: props.goalId || undefined,
    taskName: '',
    description: '',
    plannedExecutionTime: 0,
    openTaskPage: false,
    prioritiesId: 3,
    selectedType: this.props.taskTypes[0],
    selectedTypeError: this.props.taskTypes.length === 0,
    isTaskByClient: false,
    isDevOps: false,
    descriptionInvalid: false,
    tags: []
  });

  getInitialSprint = ({ selectedSprintValue, sprints }) => {
    if (selectedSprintValue) {
      return selectedSprintValue;
    }

    const activeSprint = sprints.find(sprint => sprint.statusId === IN_PROGRESS);

    return activeSprint ? activeSprint.id : 0;
  };

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

  toggleIsByClient = event => {
    const {
      target: { checked }
    } = event;

    this.setState({
      isTaskByClient: checked
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

    this.props
      .createTask(
        {
          name: this.state.taskName.trim(),
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
          isDevOps: this.state.isDevOps,
          goalId: this.state.goalId
        },
        this.state.openTaskPage,
        this.props.column
      )
      .then(id => {
        if (this.state.tags.length) {
          this.props.createTags(this.state.tags.join(), 'task', id);
        }

        if (this.props.afterCreate) {
          this.props.afterCreate();
        }
      });
  };

  validateAndSubmit = () => {
    if (!this.isDisabledSave()) {
      this.submitTask();
    }
  };

  onTypeChange = value =>
    this.setState({
      selectedType: value && !(Array.isArray(value) && !value.length) ? value : this.props.taskTypes[0]
    });

  getSprints = () => {
    let sprints = sortBy(this.props.project.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map(sprint => ({
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
    return uniqWith(
      this.props.project.users.concat(this.props.devOpsUsers && this.state.isDevOps ? this.props.devOpsUsers : []),
      isEqual
    )
      .sort((a, b) => {
        if (a.fullNameRu < b.fullNameRu) return -1;
        else if (a.fullNameRu > b.fullNameRu) return 1;
        return 0;
      })
      .map(user => ({
        value: user.id,
        label: getFullName(user)
      }));
  };

  handleChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  handleChangePlannedTime = plannedExecutionTime => {
    this.setState({
      plannedExecutionTime: plannedExecutionTime || 0
    });
  };

  addTag = tag => {
    const unicTags = [...new Set([...this.state.tags, ...tag])];
    this.setState({ tags: [...unicTags] });
  };
  deleteTag = () => tagName => {
    const tags = this.state.tags.filter(tag => tag !== tagName);
    this.setState({ tags: [...tags] });
  };

  isDisabledSave = () =>
    this.props.isCreateTaskRequestInProgress ||
    (this.validator.isDisabled && !this.state.selectedTypeError) ||
    !this.state.selectedType ||
    this.state.descriptionInvalid;

  validateDescription = description => {
    this.setState({ descriptionInvalid: description.length > MAX_DESCRIPTION_LENGTH });
  };

  generateError = () => {
    return this.state.taskName.trim().length < 4
      ? localize[this.props.lang].NAME_ERROR_LESS_SYMBOLS
      : localize[this.props.lang].NAME_ERROR_MORE_SYMBOLS;
  };

  get modalTitle() {
    const { lang } = this.props;
    return this.state.isDevOps ? localize[lang].REQUEST_TO_DEVOPS_SERVICE : localize[lang].CREATE_TASK;
  }

  toggleDevOpsTaskMode = () => {
    this.setState(
      {
        ...this.getInitialState(this.props),
        isDevOps: true
      },
      this.resetDescription
    );
  };

  resetDescription = () => {
    if (this.TextEditor) {
      this.TextEditor.resetState();
    }
  };

  projectHasDevOpsUsers = () => {
    const { users } = this.props.project;
    const globalDevopsExist = !!(this.props.devOpsUsers && this.props.devOpsUsers.length);
    return globalDevopsExist || users.some(user => !!user.roles.devops);
  };

  render() {
    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    const { lang, taskTypes } = this.props;

    const tags = this.state.tags.map((tagName, i) => {
      return (
        <Tag key={i} name={tagName} noRequest dataTip={tagName} deleteTagModal={() => this.deleteTag()(tagName)} />
      );
    });
    return (
      <Modal
        isOpen={this.props.isCreateTaskModalOpen || this.props.isCreateChildTaskModalOpen}
        onRequestClose={this.props.closeCreateTaskModal}
        contentLabel="Modal"
      >
        <form className={css.createTaskForm}>
          <h3>{this.modalTitle}</h3>

          <If condition={!this.state.isDevOps}>
            <div className={css.requestToDevOps}>
              <span className={css.requestToDevOps__link} onClick={this.toggleDevOpsTaskMode}>
                {localize[lang].REQUEST_TO_DEVOPS_SERVICE}
              </span>
            </div>
          </If>

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
                      onEnter={this.validateAndSubmit}
                      shouldMarkError={shouldMarkError}
                      errorText={this.generateError()}
                      value={this.state.taskName}
                    />
                  ),
                  'taskName',
                  this.state.taskName.trim().length < 4 || this.state.taskName.trim().length > 255
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
                <p>{localize[lang].TAGS}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Tags
                  taggable="task"
                  noRequest
                  create
                  canEdit
                  createTagsModalTask={this.addTag}
                  className={css.tagsContainer}
                >
                  {tags}
                </Tags>
              </Col>
            </Row>
          </label>
          <If condition={!this.state.isDevOps}>
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
                    options={taskTypes}
                    className={css.selectSprint}
                    value={this.state.selectedType}
                    onChange={this.onTypeChange}
                    noResultsText={localize[lang].NO_RESULTS}
                    clearable={false}
                  />
                  {this.state.selectedTypeError && <span>{localize[lang].GET_DATA_ERROR}</span>}
                </Col>
              </Row>
            </label>
          </If>
          <div className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].FROM_CLIENT}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Checkbox checked={this.state.isTaskByClient} onChange={this.toggleIsByClient} />
              </Col>
            </Row>
          </div>

          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].PRIORITY}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Priority
                  priority={this.state.prioritiesId}
                  onPrioritySet={this.handlePriorityChange}
                  text={''}
                  canEdit
                />
              </Col>
            </Row>
          </label>
          <If condition={!this.state.isDevOps || this.projectHasDevOpsUsers()}>
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
                    onInputChange={removeNumChars}
                    noResultsText={localize[lang].NO_RESULTS}
                    options={this.getUsers()}
                  />
                </Col>
              </Row>
            </label>
          </If>
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
                <p>{localize[lang].GOAL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <GoalSelector
                  searchable
                  clearable={false}
                  value={this.state.goalId}
                  sprintId={this.state.selectedSprint}
                  onChange={value => {
                    this.handleChange('goalId')({ target: { value: value.value } });
                  }}
                  options={this.props.goals}
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
                  maxLength={5}
                  postfix={localize[lang].HOURS}
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
              disabled={this.isDisabledSave()}
              onClick={this.submitTask}
              loading={this.props.isCreateTaskRequestInProgress}
            />
            <Button
              text={localize[lang].CREATE_AND_OPEN}
              htmlType="button"
              type="green-lighten"
              disabled={this.isDisabledSave()}
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
  afterCreate: PropTypes.func,
  closeCreateTaskModal: PropTypes.func.isRequired,
  column: PropTypes.string,
  createTags: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  defaultPerformerId: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  devOpsUsers: PropTypes.array,
  goalId: PropTypes.number,
  goals: PropTypes.array,
  isCreateChildTaskModalOpen: PropTypes.bool,
  isCreateTaskModalOpen: PropTypes.bool,
  isCreateTaskRequestInProgress: PropTypes.bool,
  lang: PropTypes.string,
  parentTaskId: PropTypes.number,
  project: PropTypes.object,
  selectedSprintValue: PropTypes.number,
  sprints: PropTypes.array,
  taskTypes: PropTypes.array
};

const getTaskTypes = dictionaryTypes =>
  dictionaryTypes.map(({ name, id }) => ({
    label: name,
    value: id
  }));

const mapStateToProps = state => ({
  devOpsUsers: state.UserList.devOpsUsers,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  isCreateChildTaskModalOpen: state.Project.isCreateChildTaskModalOpen,
  taskTypes: getTaskTypes(getLocalizedTaskTypes(state)),
  isCreateTaskRequestInProgress: state.Project.isCreateTaskRequestInProgress,
  lang: state.Localize.lang,
  sprints: state.Project.project.sprints,
  goals: state.Goals.goals
});

const mapDispatchToProps = {
  closeCreateTaskModal,
  createTask,
  createTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTaskModal);
