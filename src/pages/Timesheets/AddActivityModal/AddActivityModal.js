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

import {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectsForSelect
} from '../../../actions/Timesheets';
import * as activityTypes from '../../../constants/ActivityTypes';

class AddActivityModal extends Component {
  static propTypes = {
    activityTypes: PropTypes.array,
    addActivity: PropTypes.func,
    changeActivityType: PropTypes.func,
    changeProject: PropTypes.func,
    changeTask: PropTypes.func,
    clearModalState: PropTypes.func,
    filterTasks: PropTypes.func,
    getProjectsForSelect: PropTypes.func,
    getTasksForSelect: PropTypes.func,
    onClose: PropTypes.func,
    selectedActivityType: PropTypes.number,
    selectedProject: PropTypes.object,
    selectedTask: PropTypes.object,
    selectedTaskStatusId: PropTypes.number,
    startingDay: PropTypes.object,
    userId: PropTypes.number
  };

  constructor (props) {
    super(props);
    this.state = {
      activityType: 0,
      taskId: 0,
      projectId: 0,
      taskStatusId: 0,
      isOnlyMine: true,
      tasks: [],
      projects: []
    };
  }

  componentWillMount () {
    this.props.clearModalState();
  }

  changeItem = (option, name) => {
    if (option) {
      this.setState({ [name]: option.value });
      if (name === 'activityType') {
        this.props.changeActivityType(option.value);
        this.loadProjects();
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
  };

  addActivity = () => {
    const {
      selectedTask,
      selectedActivityType,
      selectedProject,
      selectedTaskStatusId,
      startingDay
    } = this.props;

    this.props.onClose();
    this.props.addActivity({
      id: `temp-${shortid.generate()}`,
      comment: null,
      task: selectedTask ? {
        id: selectedTask.value,
        name: selectedTask.label
      } : null,
      taskStatusId: selectedTask ? selectedTaskStatusId : null,
      typeId: selectedActivityType,
      spentTime: '0',
      onDate: moment(startingDay).format('YYYY-MM-DD'),
      project: selectedTask ? {
        id: selectedTask.body.projectId,
        name: this.state.projects.find(project => project.body.id === selectedTask.body.projectId).body.name
      } : selectedProject ? {
        id: selectedProject.value,
        name: selectedProject.label
      } : null
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

  handleChangeProject = (option) => {
    this.props.changeProject(option);
    this.loadTasks('', option ? option.value : null);
  }

  loadTasks = (name = '', projectId = null) => {
    this.props.getTasksForSelect(name, projectId)
      .then(options => this.setState({tasks: options.options}));
  }

  loadProjects = (name = '') => {
    const hideEmptyValue = this.state.activityType === 1;
    this.props.getProjectsForSelect(name, hideEmptyValue)
      .then(options => this.setState({projects: options.options}));
  }

  render () {
    const formLayout = {
      left: 5,
      right: 7
    };

    return (
      <Modal
        isOpen
        onRequestClose={this.props.onClose}
        contentLabel="Modal"
        closeTimeoutMS={200}
      >
        <div className={css.addActivityForm}>
          <h3>Добавить активность</h3>
          <hr/>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.left}>
                Тип активности:
              </Col>
              <Col xs={12} sm={formLayout.right}>
                <SelectDropdown
                  multi={false}
                  value={this.props.selectedActivityType}
                  placeholder="Тип активности"
                  onChange={(option) => this.changeItem(option, 'activityType')}
                  options={
                    this.props.activityTypes.length
                      ? this.props.activityTypes.map(
                        element => {return {label: element.name, value: element.id};}
                      ).concat([{ value: 0, label: 'Не выбрано' }])
                      : null
                  }
                />
              </Col>
            </Row>
          </label>
          {
            this.state.activityType && this.state.activityType === activityTypes.IMPLEMENTATION
            ? [
              <label key="onlyMineLabel" className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <Checkbox
                      checked={this.state.isOnlyMine}
                      onChange={this.toggleMine}
                      label="Только мои задачи"
                    />
                  </Col>
                </Row>
              </label>,
              !this.state.isOnlyMine
              ? <label key="projectSelectLabel" className={css.formField}>
                  <Row>
                    <Col xs={12} sm={formLayout.left}>
                      Проект:
                    </Col>
                    <Col xs={12} sm={formLayout.right}>
                      <SelectDropdown
                        multi={false}
                        value={this.props.selectedProject}
                        placeholder="Выберите проект"
                        onChange={this.handleChangeProject}
                        options={this.state.projects}
                      />
                    </Col>
                  </Row>
                </label> : null,
              this.props.selectedProject || this.state.isOnlyMine
              ? <label key="taskSelectLabel" className={css.formField}>
                  <Row>
                    <Col xs={12} sm={formLayout.left}>
                      Задача:
                    </Col>
                    <Col xs={12} sm={formLayout.right}>
                      <SelectDropdown
                        multi={false}
                        value={this.props.selectedTask}
                        placeholder="Выберите задачу"
                        onChange={option => this.props.changeTask(option)}
                        options={this.state.tasks}
                      />
                    </Col>
                  </Row>
                </label> : null]
              : this.state.activityType && this.state.activityType !== activityTypes.IMPLEMENTATION
                && this.state.activityType !== activityTypes.VACATION
                && this.state.activityType !== activityTypes.HOSPITAL
              ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Проект:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectDropdown
                        multi={false}
                        value={this.props.selectedProject}
                        placeholder="Выберите проект"
                        onChange={this.handleChangeProject}
                        options={this.state.projects}
                      />
                  </Col>
                </Row>
              </label>
            : null
          }
          {
            this.props.selectedTask
              ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Статус:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectDropdown
                      multi={false}
                      value={this.props.selectedTaskStatusId}
                      onChange={(option) => this.changeItem(option, 'taskStatusId')}
                      placeholder="Выбрать статус"
                      options={[
                        {
                          value: 2,
                          label: 'Develop'
                        },
                        {
                          value: 4,
                          label: 'Code Review'
                        },
                        {
                          value: 6,
                          label: 'QA'
                        }
                      ]}
                    />
                  </Col>
                </Row>
              </label>
              : null
          }
          <div className={css.footer}>
            <Button
              text="Добавить"
              htmlType="submit"
              type="green"
              onClick={this.addActivity}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  activityTypes: state.Dictionaries.magicActivityTypes,
  selectedActivityType: state.Timesheets.selectedActivityType,
  selectedTask: state.Timesheets.selectedTask,
  selectedTaskStatusId: state.Timesheets.selectedTaskStatusId,
  selectedProject: state.Timesheets.selectedProject,
  startingDay: state.Timesheets.startingDay,
  filteredTasks: state.Timesheets.filteredTasks,
  userId: state.Auth.user.id
});

const mapDispatchToProps = {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectsForSelect
};

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityModal);
