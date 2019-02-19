import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import * as css from '../Timesheets.scss';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { getProjectSprints } from '../../../actions/Project';
import {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectsForSelect
} from '../../../actions/Timesheets';
import getStatusOptions from '../../../utils/getDraftStatusOptions';
import * as activityTypes from '../../../constants/ActivityTypes';
import localize from './addActivityModal.json';
import { getLocalizedTaskStatuses, getMagicActiveTypes } from '../../../selectors/dictionaries';
import { getStopStatusByGroup } from '../../../utils/TaskStatuses';

class AddActivityModal extends Component {
  static propTypes = {
    activityTypes: PropTypes.array,
    addActivity: PropTypes.func,
    changeActivityType: PropTypes.func,
    changeProject: PropTypes.func,
    changeTask: PropTypes.func,
    clearModalState: PropTypes.func,
    filterTasks: PropTypes.func,
    getProjectSprints: PropTypes.func,
    getProjectsForSelect: PropTypes.func,
    getTasksForSelect: PropTypes.func,
    lang: PropTypes.string,
    onClose: PropTypes.func,
    selectedActivityType: PropTypes.number,
    selectedProject: PropTypes.object,
    selectedTask: PropTypes.object,
    selectedTaskStatusId: PropTypes.number,
    sprints: PropTypes.array,
    startingDay: PropTypes.object,
    taskStatuses: PropTypes.array,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      activityType: 0,
      taskId: 0,
      projectId: 0,
      taskStatusId: 0,
      selectedSprint: null,
      isOnlyMine: true,
      tasks: [],
      projects: []
    };
  }

  componentWillMount() {
    this.props.clearModalState();
  }

  changeItem = (option, name) => {
    if (option) {
      this.setState({ [name]: option.value });
      if (name === 'activityType') {
        this.props.changeActivityType(option.value);
        if (option.value === activityTypes.IMPLEMENTATION) {
          this.props.changeProject(null);
          if (this.state.isOnlyMine) {
            this.loadTasks();
          }
        } else {
          this.props.changeTask(null);
        }
      }
      if (name === 'taskStatusId') {
        this.props.changeTask(this.props.selectedTask, option.value);
      }
    } else {
      this.setState({ [name]: 0 });
    }
    if (!option && name === 'taskStatusId') {
      this.props.changeTask(this.props.selectedTask, null);
    }
  };

  addActivity = e => {
    e.preventDefault();

    const { selectedTask, selectedActivityType, selectedProject, selectedTaskStatusId, startingDay } = this.props;
    const { selectedSprint } = this.state;
    const taskStatusId = selectedTask ? selectedTaskStatusId : null;

    const getSprint = () => {
      if (this.isNoTaskProjectActivity() && selectedSprint) {
        return selectedSprint.value;
      } else if (selectedTask) {
        return selectedTask.body.sprint;
      } else {
        return null;
      }
    };

    const getProject = () => {
      const holidayOrHospital = selectedActivityType === 5 || selectedActivityType === 7;
      if (holidayOrHospital || (selectedProject && selectedProject.value === 0)) {
        return null;
      }
      if (selectedTask) {
        return {
          id: selectedTask.body.projectId,
          name: this.state.projects.find(project => project.body.id === selectedTask.body.projectId).body.name,
          prefix: selectedTask.body.prefix
        };
      } else if (selectedProject) {
        return {
          id: selectedProject.value,
          name: selectedProject.label,
          prefix: selectedProject.body.prefix
        };
      } else {
        return null;
      }
    };
    this.props.onClose();
    this.props.addActivity({
      id: `temp-${shortid.generate()}`,
      comment: null,
      task: selectedTask
        ? {
            id: selectedTask.value,
            name: selectedTask.body.name,
            sprint: getSprint()
          }
        : null,
      taskStatusId: getStopStatusByGroup(taskStatusId),
      typeId: selectedActivityType,
      spentTime: '0',
      sprintId: getSprint() ? getSprint().id : null,
      sprint: getSprint(),
      onDate: moment(startingDay).format('YYYY-MM-DD'),
      project: getProject()
    });
  };

  toggleMine = () => {
    this.setState(oldState => {
      const isOnlyMine = !oldState.isOnlyMine;
      this.props.changeProject(null);
      this.props.changeTask(null);
      if (isOnlyMine) {
        this.loadTasks();
      }
      return { isOnlyMine };
    });
  };

  isNoTaskProjectActivity = () => {
    const { activityType } = this.state;
    return activityType !== activityTypes.VACATION && activityType !== activityTypes.HOSPITAL;
  };

  handleChangeProject = option => {
    this.handleChangeSprint(null);
    this.props.changeTask(null);
    this.props.changeProject(option);
    this.loadTasks('', option ? option.value : null);
    if (this.isNoTaskProjectActivity() && (option && option.value !== 0)) {
      this.props.getProjectSprints(option.value);
    }
  };

  loadTasks = (name = '', projectId = null, sprintId = null) => {
    this.props.getTasksForSelect(name, projectId, sprintId).then(options => this.setState({ tasks: options.options }));
  };

  loadProjects = activityType => {
    const hideEmptyValue = activityType === 1;
    this.props
      .getProjectsForSelect('', hideEmptyValue, true)
      .then(options => this.setState({ projects: options.options }));
  };

  handleChangeSprint = option => {
    this.setState({ selectedSprint: option }, () => {
      if (this.state.activityType === activityTypes.IMPLEMENTATION) {
        this.loadTasks(null, null, option ? option.value.id : null);
        if (option) {
          this.props.changeTask(null);
        }
      }
    });
  };

  handleChangeActivity = option => {
    if (!option) {
      this.setState({ activityType: 0 }, () => this.props.changeActivityType(null));
    } else {
      this.changeItem(option, 'activityType');
      this.loadProjects(option.value);
    }
  };

  getSprintOptions = () => {
    const { sprints } = this.props;
    return sprints
      ? sprints.map(sprint => {
          return {
            label: sprint.name,
            value: sprint
          };
        })
      : null;
  };

  render() {
    const { lang } = this.props;
    const formLayout = {
      left: 5,
      right: 7
    };
    this.getSprintOptions(2);
    return (
      <Modal isOpen onRequestClose={this.props.onClose} contentLabel="Modal" closeTimeoutMS={200}>
        <form className={css.addActivityForm}>
          <h3>{localize[lang].ADD_ACTIVITY}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.left}>
                {localize[lang].ACTIVITY_TYPE}:
              </Col>
              <Col xs={12} sm={formLayout.right}>
                <SelectDropdown
                  multi={false}
                  value={this.props.selectedActivityType}
                  placeholder={localize[lang].ACTIVITY_TYPE}
                  onChange={this.handleChangeActivity}
                  options={
                    this.props.activityTypes.length
                      ? this.props.activityTypes.map(element => {
                          return { label: localize[lang][element.codename], value: element.id };
                        })
                      : null
                  }
                  clearable={false}
                />
              </Col>
            </Row>
          </label>
          {this.state.activityType && this.state.activityType === activityTypes.IMPLEMENTATION
            ? [
                <label key="onlyMineLabel" className={css.formField}>
                  <Row>
                    <Col xs={12} sm={formLayout.left} />
                    <Col xs={12} sm={formLayout.right}>
                      <Checkbox
                        checked={this.state.isOnlyMine}
                        onChange={this.toggleMine}
                        label={localize[lang].MY_TASKS}
                      />
                    </Col>
                  </Row>
                </label>,
                !this.state.isOnlyMine ? (
                  <label key="projectSelectLabel" className={css.formField}>
                    <Row>
                      <Col xs={12} sm={formLayout.left}>
                        {localize[lang].PROJECT}
                      </Col>
                      <Col xs={12} sm={formLayout.right}>
                        <SelectDropdown
                          multi={false}
                          value={this.props.selectedProject}
                          placeholder={localize[lang].SELECT_PROJECT}
                          onChange={this.handleChangeProject}
                          options={this.state.projects}
                        />
                      </Col>
                    </Row>
                  </label>
                ) : null,
                this.props.selectedProject && this.props.selectedProject.value !== 0 ? (
                  <label className={css.formField} key="noTaskActivitySprint">
                    <Row>
                      <Col xs={12} sm={formLayout.left}>
                        {localize[lang].SPRINT}
                      </Col>
                      <Col xs={12} sm={formLayout.right}>
                        <SelectDropdown
                          multi={false}
                          value={this.state.selectedSprint}
                          placeholder={localize[lang].SELECT_SPRINT}
                          onChange={this.handleChangeSprint}
                          options={this.getSprintOptions()}
                          onClear={() => this.handleChangeSprint(null)}
                          canClear
                        />
                      </Col>
                    </Row>
                  </label>
                ) : null,
                this.props.selectedProject || this.state.isOnlyMine ? (
                  <label key="taskSelectLabel" className={css.formField}>
                    <Row>
                      <Col xs={12} sm={formLayout.left}>
                        {localize[lang].TASK}
                      </Col>
                      <Col xs={12} sm={formLayout.right}>
                        <SelectDropdown
                          multi={false}
                          value={this.props.selectedTask}
                          placeholder={localize[lang].SELECT_TASKS}
                          onChange={option => this.props.changeTask(option)}
                          options={this.state.tasks}
                        />
                      </Col>
                    </Row>
                  </label>
                ) : null
              ]
            : this.state.activityType &&
              this.state.activityType !== activityTypes.IMPLEMENTATION &&
              this.state.activityType !== activityTypes.VACATION &&
              this.state.activityType !== activityTypes.HOSPITAL
              ? [
                  <label className={css.formField} key="noTaskActivityProject">
                    <Row>
                      <Col xs={12} sm={formLayout.left}>
                        {localize[lang].PROJECT}
                      </Col>
                      <Col xs={12} sm={formLayout.right}>
                        <SelectDropdown
                          multi={false}
                          value={this.props.selectedProject}
                          placeholder={localize[lang].SELECT_PROJECT}
                          onChange={this.handleChangeProject}
                          options={this.state.projects}
                        />
                      </Col>
                    </Row>
                  </label>,
                  this.props.selectedProject && this.props.selectedProject.value !== 0 ? (
                    <label className={css.formField} key="noTaskActivitySprint">
                      <Row>
                        <Col xs={12} sm={formLayout.left}>
                          {localize[lang].SPRINT}
                        </Col>
                        <Col xs={12} sm={formLayout.right}>
                          <SelectDropdown
                            multi={false}
                            value={this.state.selectedSprint}
                            placeholder={localize[lang].SELECT_SPRINT}
                            onChange={this.handleChangeSprint}
                            options={this.getSprintOptions()}
                          />
                        </Col>
                      </Row>
                    </label>
                  ) : null
                ]
              : null}
          {this.props.selectedTask ? (
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.left}>
                  {localize[lang].STATUS}
                </Col>
                <Col xs={12} sm={formLayout.right}>
                  <SelectDropdown
                    multi={false}
                    value={this.props.selectedTaskStatusId}
                    onChange={option => this.changeItem(option, 'taskStatusId')}
                    placeholder={localize[lang].SELECT_STATUS}
                    options={getStatusOptions(this.props.taskStatuses)}
                  />
                </Col>
              </Row>
            </label>
          ) : null}
          <div className={css.footer}>
            <Button
              text={localize[lang].ADD}
              disabled={
                !this.props.selectedActivityType ||
                (this.props.selectedActivityType === 1 && !this.props.selectedTaskStatusId)
              }
              htmlType="submit"
              type="green"
              onClick={this.addActivity}
            />
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  activityTypes: getMagicActiveTypes(state),
  selectedActivityType: state.Timesheets.selectedActivityType,
  selectedTask: state.Timesheets.selectedTask,
  selectedTaskStatusId: state.Timesheets.selectedTaskStatusId,
  selectedProject: state.Timesheets.selectedProject,
  startingDay: state.Timesheets.startingDay,
  taskStatuses: getLocalizedTaskStatuses(state),
  filteredTasks: state.Timesheets.filteredTasks,
  sprints: state.Project.project.sprints,
  userId: state.Auth.user.id,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectsForSelect,
  getProjectSprints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddActivityModal);
