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
import { getProjectSprints, gettingProjectSprintsSuccess as clearSprints } from '../../../actions/Project';
import { showNotification } from '../../../actions/Notifications';
import {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect
} from '../../../actions/Timesheets';
import { getProjectsAll } from '~/actions/Projects';
import getStatusOptions from '../../../utils/getDraftStatusOptions';
import * as activityTypes from '../../../constants/ActivityTypes';
import localize from './addActivityModal.json';
import { getLocalizedTaskStatuses, getMagicActiveTypes } from '../../../selectors/dictionaries';
import { getStopStatusByGroup } from '../../../utils/TaskStatuses';
import { TASK_STATUSES } from '~/constants/TaskStatuses';

class AddActivityModal extends Component<any, any> {
  static propTypes = {
    activityTypes: PropTypes.array,
    addActivity: PropTypes.func,
    changeActivityType: PropTypes.func,
    changeProject: PropTypes.func,
    changeTask: PropTypes.func,
    clearModalState: PropTypes.func,
    clearSprints: PropTypes.func,
    filterTasks: PropTypes.func,
    getProjectSprints: PropTypes.func,
    getProjectsAll: PropTypes.func,
    getTasksForSelect: PropTypes.func,
    lang: PropTypes.string,
    onClose: PropTypes.func,
    projects: PropTypes.array,
    selectedActivityType: PropTypes.number,
    selectedProject: PropTypes.object,
    selectedTask: PropTypes.object,
    selectedTaskStatusId: PropTypes.number,
    showNotification: PropTypes.func,
    sprints: PropTypes.array,
    startingDay: PropTypes.object,
    taskStatuses: PropTypes.array,
    tempTimesheetsList: PropTypes.array,
    timesheetsList: PropTypes.array,
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
      tasks: [],
      projects: [],
      selectedType: this.getType[0]
    };
  }

  get getType() {
    const { lang } = this.props;
    return [
      {
        value: [],
        label: localize[lang].ALL_TASKS_OPTION_LABEL,
      },
      {
        value: [TASK_STATUSES.NEW],
        label: 'New',
      },
      {
        value: [TASK_STATUSES.DEV_PLAY, TASK_STATUSES.DEV_STOP],
        label: 'Develop',
      },
      {
        value: [TASK_STATUSES.CODE_REVIEW_PLAY, TASK_STATUSES.CODE_REVIEW_STOP],
        label: 'Code Review',
      },
      {
        value: [TASK_STATUSES.QA_PLAY, TASK_STATUSES.QA_STOP],
        label: 'QA',
      },
      {
        value: [TASK_STATUSES.DONE],
        label: 'Done',
      },
      // {
      //   value: [TASK_STATUSES.CLOSED, TASK_STATUSES.CLOSED],
      //   label: 'Closed',
      // },
    ]
  }

  get filteredTasks() {
    if (this.state.selectedType.value.length) {
      return this.state.tasks.filter(task => this.state.selectedType.value.includes(task.body.statusId))
    }

    return this.state.tasks;
  }

  selectType = (option) => {
    if (option.label !== this.state.selectedType.label) {
      this.props.changeTask(null);
    }
    this.setState({ selectedType: option })
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
          this.loadTasks();
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

  activityAlreadyExists = (selectedTask, taskStatusId, timesheetsCurrentList) => {
    if (selectedTask) {
      const {
        body: { id, typeId }
      } = selectedTask;
      const _taskStatusId = getStopStatusByGroup(taskStatusId);
      for (let i = 0; i < timesheetsCurrentList.length; i++) {
        const item = timesheetsCurrentList[i];
        if (item.task && item.task.id === id && item.typeId === typeId && item.taskStatusId === _taskStatusId) {
          return true;
        }
      }
    }
    return false;
  };

  addActivity = e => {
    e.preventDefault();

    const {
      selectedTask,
      selectedActivityType,
      selectedProject,
      selectedTaskStatusId,
      startingDay,
      timesheetsList,
      tempTimesheetsList
    } = this.props;
    const { selectedSprint } = this.state;
    const taskStatusId = selectedTask ? selectedTaskStatusId : null;
    if (
      this.activityAlreadyExists(selectedTask, taskStatusId, timesheetsList) ||
      this.activityAlreadyExists(selectedTask, taskStatusId, tempTimesheetsList)
    ) {
      this.props.showNotification(
        {
          message: localize[this.props.lang].ACTIVITY_ALREADY_EXISTS,
          type: 'error'
        },
        4000
      );
    }

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
          name: this.state.projects.find(project => project.id === selectedTask.body.projectId).name,
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

  isNoTaskProjectActivity = () => {
    const { activityType } = this.state;
    return activityType !== activityTypes.VACATION && activityType !== activityTypes.HOSPITAL;
  };

  handleChangeProject = option => {
    this.handleChangeSprint(null);
    this.props.changeTask(null);
    this.props.changeProject(option);
    this.setState({
      projectId: option && option.value
    });
    this.loadTasks('', option ? option.value : null);
    if (this.isNoTaskProjectActivity() && (option && option.value !== 0)) {
      this.props.getProjectSprints(option.value);
    }
  };

  loadTasks = (name: string | null = '', projectId: any = null, sprintId : any = null) => {
    this.props.getTasksForSelect(name, projectId, sprintId)
      .then(({ options }) => {
        function filterTasksByStatus(allTasks, statuses) {
          return allTasks.filter(task => statuses.includes(task.body.statusId));
        }

        const sortedOptions = options.sort((a, b) => Date.parse(b.body.createdAt) - Date.parse(a.body.createdAt));

        const newTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.NEW]);
        const devTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.DEV_PLAY, TASK_STATUSES.DEV_STOP]);
        const codeReviewTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.CODE_REVIEW_PLAY, TASK_STATUSES.CODE_REVIEW_STOP]);
        const QATasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.QA_PLAY, TASK_STATUSES.QA_STOP]);
        const cancelTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.CANCELED, TASK_STATUSES.CLOSED]);
        const doneTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.DONE]);

        this.setState({ tasks: [
            ...newTasks,
            ...devTasks,
            ...codeReviewTasks,
            ...QATasks,
            ...cancelTasks,
            ...doneTasks
          ] });
      });
  };

  loadProjects = () => {
    this.props.getProjectsAll();
    this.setState({ projects: this.props.projects });
  };

  handleChangeSprint = option => {
    this.props.clearSprints([]);
    this.setState({ selectedSprint: option }, () => {
      if (this.state.activityType === activityTypes.IMPLEMENTATION) {
        this.loadTasks(null, this.state.projectId, option ? option.value.id : null);
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
      this.loadProjects();
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

  getProjectOptions = () => {
    const { projects } = this.props;
    return projects.length
      ? projects.map(project => {
          return {
            label: project.name,
            value: project.id
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
    const isNeedShowField = this.state.activityType && this.state.activityType !== activityTypes.VACATION && this.state.activityType !== activityTypes.HOSPITAL;

    this.getSprintOptions();
    return (
      <Modal isOpen onRequestClose={this.props.onClose} contentLabel="Modal" closeTimeoutMS={200}>
        <form className={css.addActivityForm}>
          <h3>{localize[lang].ADD_ACTIVITY}</h3>
          <hr />
          <Row>
            <Col xs={12} sm={4}>
              <label className={css.formField}>
                <span>{localize[lang].ACTIVITY_TYPE}:</span>
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
              </label>
            </Col>
            <Col xs={12} sm={4}>
              <label key="projectSelectLabel" className={css.formField}>
                <span>{localize[lang].PROJECT}</span>
                <SelectDropdown
                  disabled={!isNeedShowField}
                  multi={false}
                  value={this.props.selectedProject}
                  placeholder={localize[lang].SELECT_PROJECT}
                  onChange={this.handleChangeProject}
                  options={this.getProjectOptions()}
                  onClear={() => this.handleChangeProject(null)}
                  canClear
                />
              </label>
            </Col>
            <Col xs={12} sm={4}>
              <label className={css.formField} key="noTaskActivitySprint">
                <span>{localize[lang].SPRINT}</span>
                <SelectDropdown
                  disabled={!isNeedShowField}
                  multi={false}
                  value={this.state.selectedSprint}
                  placeholder={localize[lang].SELECT_SPRINT}
                  onChange={this.handleChangeSprint}
                  options={this.getSprintOptions()}
                  onClear={() => this.handleChangeSprint(null)}
                  canClear
                />
              </label>
            </Col>
            <Col xs={12} sm={4}>
            <label key="typeTaskSelectLabel" className={css.formField}>
                  <span>{localize[lang].TYPE_TASK}</span>
                  <SelectDropdown
                    multi={false}
                    value={this.state.selectedType}
                    placeholder={localize[lang].SELECT_TYPE_TASK}
                    onChange={this.selectType}
                    options={this.getType}
                  />
            </label>
            </Col>
            {
              this.state.activityType === activityTypes.IMPLEMENTATION &&
              <Col xs={12} sm={4}>
                <label key="taskSelectLabel" className={css.formField}>
                  {localize[lang].TASK}
                  <SelectDropdown
                    multi={false}
                    value={this.props.selectedTask}
                    placeholder={localize[lang].SELECT_TASKS}
                    onChange={option => this.props.changeTask(option)}
                    options={this.state.tasks}
                  />
                </label>
              </Col>
            }
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
          </Row>
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
  projects: state.Projects.projectsAll,
  sprints: state.Project.project.sprints,
  userId: state.Auth.user.id,
  lang: state.Localize.lang,
  timesheetsList: state.Timesheets.list,
  tempTimesheetsList: state.Timesheets.tempTimesheets
});

const mapDispatchToProps = {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectSprints,
  showNotification,
  getProjectsAll,
  clearSprints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddActivityModal);
