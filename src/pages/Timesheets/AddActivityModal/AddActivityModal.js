import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import Select from 'react-select';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import * as css from '../Timesheets.scss';
import {
  changeTask,
  changeProject,
  clearModalState,
  addActivity,
  changeActivityType,
  getTasksForSelect,
  getProjectsForSelect
} from '../../../actions/Timesheets';

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
  }

  constructor (props) {
    super(props);
    this.state = {
      activityType: 0,
      taskId: 0,
      projectId: 0,
      taskStatusId: 0
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
        if (option.value === 1) {
          this.props.changeProject(null);
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
  }

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
        id: selectedTask.body.projectId
      } : selectedProject ? {
        id: selectedProject.value,
        name: selectedProject.label
      } : null
    });
  }

  render () {

    const formLayout = {
      left: 5,
      right: 7
    };

    const SelectAsync = Select.AsyncCreatable;

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
            this.state.activityType && this.state.activityType === 1
            ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Задача:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectAsync
                      key="taskAsyncSelect"
                      promptTextCreator={label => `Поиск задачи ${label}`}
                      searchPromptText={'Введите название Задачи'}
                      multi={false}
                      ignoreCase={false}
                      placeholder="Выберите задачу"
                      loadOptions={this.props.getTasksForSelect}
                      filterOption={el => el}
                      onChange={option => this.props.changeTask(option)}
                      value={this.props.selectedTask}
                    />
                  </Col>
                </Row>
              </label>
            : this.state.activityType && this.state.activityType !== 1
            ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Проект:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectAsync
                      key="projectAsyncSelect"
                      promptTextCreator={label => `Поиск проекта ${label}`}
                      searchPromptText={'Введите название Проекта'}
                      multi={false}
                      ignoreCase={false}
                      placeholder="Выберите проект"
                      loadOptions={this.props.getProjectsForSelect}
                      filterOption={el => el}
                      onChange={option => this.props.changeProject(option)}
                      value={this.props.selectedProject}
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
