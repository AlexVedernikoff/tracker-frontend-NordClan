import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '~/components/Input';
import ActivitiesTable from '~/pages/Timesheets/AddActivityModal/ActivitiesTable';
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
import {getAllProjects, getProjectsAll} from '~/actions/Projects';
import * as activityTypes from '../../../constants/ActivityTypes';
import localize from './addActivityModal.json';
import { getLocalizedTaskStatuses, getMagicActiveTypes } from '../../../selectors/dictionaries';
import { TASK_STATUSES, TASK_STATUSES_GROUPS, CANCELED, CLOSED } from '~/constants/TaskStatuses';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

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
    projectsAll: PropTypes.array,
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
    userId: PropTypes.number,
    globalRole:PropTypes.string
  };
  debounceLoadTask: any

  constructor(props) {
    super(props);
    this.state = {
      activityType: 1,
      taskId: 0,
      projectId: null,
      taskStatusId: 0,
      selectedSprint: null,
      tasks: [],
      projects: [],
      projectsAll:[],
      sprints: [],
      selectedType: this.statuses[0],
      search: '',
      role:''
    };

    this.debounceLoadTask = debounce(() => this.loadTasks(this.state.search, this.state.projectId, this.state.selectedSprint ? this.state.selectedSprint.value.id : null), 1000)
  }

  get statuses() {
    const { lang } = this.props;

    const taskStatusesGroup: { [key: string]: number[] } = {
      [localize[lang].ALL_TASKS_OPTION_LABEL]: [],
      ...cloneDeep(TASK_STATUSES_GROUPS)
    }
    return Object.entries(taskStatusesGroup)
      .filter(([key]) => key !== 'CANCELED' && key !== 'CLOSED')
      .map(([key, values]) => {
        return {
          label: key.split('_').map(title => title.charAt(0) + title.slice(1).toLowerCase()).join(' '),
          value: [...values]
        }
      })
  }

  get filteredTasks() {
    const { tasks } = this.state;
    if (this.state.selectedType.value.length) {
      return tasks.filter(task => this.state.selectedType.value.includes(task.body.statusId));
    }
    return tasks;
  }

  selectType = (option) => {
    if (option.label !== this.state.selectedType.label) {
      this.props.changeTask(null);
    }
    this.setState({ selectedType: option });
  }

  componentWillReceiveProps(newProps) {
        if(newProps.role !== this.props.globalRole)
          this.setState({role:newProps.globalRole})
    /* const isUserHavePermissionsToViewAllProjects = this.state.role === 'ADMIN' || this.state.role === 'VISOR';
    console.log(newProps)
    const oldProjects = this.props.projects
    const newProjects = isUserHavePermissionsToViewAllProjects ? newProps.projectsAll : newProps.projects
    console.log(newProps.globalRole,isUserHavePermissionsToViewAllProjects, isEqual(newProjects, oldProjects), newProps)
    //if (!isEqual(newProjects, oldProjects)) {
      console.log('!!!!')
      this.setState({ projects: this.convertProjectsFromApi(newProjects) })
    //}
     */
    if (!isEqual(newProps.projectsAll, this.props.projectsAll))
      this.setState({ projectsAll: this.convertProjectsFromApi(newProps.projectsAll) })
    if (!isEqual(newProps.projects, this.props.projects))
      this.setState({ projects: this.convertProjectsFromApi(newProps.projects) })
    if (newProps.sprints && !isEqual(newProps.sprints, this.props.sprints))
      this.setState({ sprints: this.convertSprintFromApi(newProps.sprints) })
  }

  convertSprintFromApi = (sprints) => {
    return sprints.map((item) => {
      return {
        label: item?.name,
        value: item?.id,
      }
    })
  }

  loadProjects = () => {
    this.props.getProjectsAll();
    this.setState({ projects: this.convertProjectsFromApi(this.props.projects) });
    this.setState({ projectsAll: this.convertProjectsFromApi(this.props.projectsAll) });
  };

  componentWillMount() {
    this.clearState();
    this.loadProjects()
    this.loadTasks().then((tasks) => {
      this.setState({ projects: this.getProjects(tasks)})
    })
  }

  clearState = () => {
    this.props.clearSprints()
    this.props.clearModalState();
  }

  setSearch = e => {
    this.setState({ search: e.target.value }, () => {
      this.debounceLoadTask()
    });
  }

  changeItem = (option, name) => {
    if (option) {
      this.setState({ [name]: option.value });
      if (name === 'activityType') {
        this.props.changeActivityType(option.value);
        if (option.value === activityTypes.IMPLEMENTATION) {
          this.props.changeProject(null);
          this.loadTasks().then((tasks) => {
            this.setState({ projects: this.getProjects(tasks)})
          })
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

  activityAlreadyExists = (selectedTask, timesheetsCurrentList) => {
    if (selectedTask) {
      const {
        body: { id, typeId }
      } = selectedTask;
      for (let i = 0; i < timesheetsCurrentList.length; i++) {
        const item = timesheetsCurrentList[i];
        if (item.task && item.task.id === id && item.typeId === typeId) {
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
      startingDay,
      timesheetsList,
      tempTimesheetsList
    } = this.props;
    const { selectedSprint } = this.state;
    if (
      this.activityAlreadyExists(selectedTask, timesheetsList) ||
      this.activityAlreadyExists(selectedTask, tempTimesheetsList)
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
          name: this.state.projects.find(project => project.value === selectedTask.body.projectId).label,
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
      // taskStatusId: getStopStatusByGroup(taskStatusId),
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
    this.props.clearSprints([]);
    this.props.changeProject(option);
    this.setState({
      projectId: option && option.value
    });
    this.loadTasks('', option ? option.value : null).then((tasks) => {
      if (this.isNoTaskProjectActivity() && this.props.selectedActivityType !== activityTypes.IMPLEMENTATION) {
        this.props.getProjectSprints(option.value).then(() => {
          this.setState({ sprints: this.props.sprints })
        });
      }
      else {
        this.setState({ sprints: this.getSprints(tasks) })
      }
    })
  };

  getSprints = (tasks) => {
    return Object.values(tasks?.reduce((result, task) => {
      result[task.body.sprintId] = {
        label: task.body.sprint?.name,
        value: task.body.sprint,
      }
      return result
    }, {}) || {})
  }

  loadTasks = (name: string | null = '', projectId: any = null, sprintId : any = null) => {
    const { userId } = this.props
    return this.props.getTasksForSelect(name, projectId, sprintId, userId)
      .then(({ options }) => {
        function filterTasksByStatus(allTasks, statuses) {
          return allTasks.filter(task => {
            return statuses.includes(task.body.statusId)});
        }

        const sortedOptions = options.sort((a, b) => Date.parse(b.body.createdAt) - Date.parse(a.body.createdAt));

        const newTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.NEW]);
        const devTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.DEV_PLAY, TASK_STATUSES.DEV_STOP]);
        const codeReviewTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.CODE_REVIEW_PLAY, TASK_STATUSES.CODE_REVIEW_STOP]);
        const QATasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.QA_PLAY, TASK_STATUSES.QA_STOP]);
        const cancelTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.CANCELED, TASK_STATUSES.CLOSED]);
        const doneTasks = filterTasksByStatus(sortedOptions, [TASK_STATUSES.DONE]);
        const tasks = [
            ...newTasks,
            ...devTasks,
            ...codeReviewTasks,
            ...QATasks,
            ...cancelTasks,
            ...doneTasks
          ]
        this.setState({ tasks });
        return tasks
      });
  };

  getProjects = (tasks) => {
    return Object.values(tasks?.reduce((result, task) => {
      result[task.body.projectId] = {
        label: task.body.project?.name,
        value: task.body.projectId,
        body: {
          name: task.body.project?.name,
          id: task.body.projectId,
          prefix: task.body.project?.prefix
        }
      }
      return result
    }, {}) || {})
  }

  convertProjectsFromApi = (projects: { name: string, id: number, prefix: string }[] = []) => {
    return projects.map(item => {
      return {
        value: item.id,
        label: item.name,
        body: {
          ...item
        }
      }
    })
  }

  handleChangeSprint = option => {
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
      // if(this.state.role !== 'VISOR' && this.state.role !== 'ADMIN') {
      //   this.handleChangeProject(null)
      //   this.handleChangeSprint(null)
      // }
      if (option.value !== activityTypes.IMPLEMENTATION) {
        this.loadProjects()
      }
    }
  };

  getSprintOptions = () => {
    return this.state.sprints
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
                  options={this.state.role === 'VISOR' || this.state.role === 'ADMIN' ? this.state.projectsAll : this.state.projects || null}
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
            {
              this.state.activityType === activityTypes.IMPLEMENTATION &&
              <Col xs={12} sm={4}>
                <label key="typeTaskSelectLabel" className={css.formField}>
                  <span>{localize[lang].TYPE_TASK}</span>
                  <SelectDropdown
                    disabled={!isNeedShowField}
                    multi={false}
                    value={this.state.selectedType}
                    placeholder={localize[lang].SELECT_TYPE_TASK}
                    onChange={this.selectType}
                    options={this.statuses}
                  />
                </label>
              </Col>
            }
            {
              this.state.activityType === activityTypes.IMPLEMENTATION &&
              <Col xs={12} sm={4}>
                <label key="taskSearch" className={css.formField}>
                  <span>{localize[lang].SEARCH}</span>
                  <Input
                    type="text"
                    placeholder={localize[lang].SEARCH}
                    value={this.state.search}
                    onChange={this.setSearch}
                  />
                </label>
              </Col>
            }
            <Col xs={12}>
              <ReactCSSTransitionGroup
                transitionName="animatedElement"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
              >
              {
                this.state.activityType === activityTypes.IMPLEMENTATION &&
                  <ActivitiesTable changeTask={this.props.changeTask} tasks={this.filteredTasks} statuses={this.statuses}/>
              }
              </ReactCSSTransitionGroup>
            </Col>
          </Row>
          <div className={css.footer}>
            <Button
              text={localize[lang].ADD}
              disabled={
                !this.props.selectedActivityType ||
                (this.props.selectedActivityType === 1 && !this.props.selectedTask)
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
  selectedActivityType: state.Timesheets.selectedActivityType || 0,
  selectedTask: state.Timesheets.selectedTask,
  selectedTaskStatusId: state.Timesheets.selectedTaskStatusId,
  selectedProject: state.Timesheets.selectedProject,
  startingDay: state.Timesheets.startingDay,
  taskStatuses: getLocalizedTaskStatuses(state),
  filteredTasks: state.Timesheets.filteredTasks,
  projects: state.Projects.projects,
  projectsAll: state.Projects.projectsAll,
  sprints: state.Project.project.sprints,
  userId: state.Auth.user.id,
  globalRole:state.Auth.user.globalRole,
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
  getAllProjects,
  clearSprints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddActivityModal);
