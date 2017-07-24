import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import TaskCard from '../../../components/TaskCard';
import PerformerModal from '../../../components/PerformerModal';
import PhaseColumn from './PhaseColumn';
import SelectDropdown from '../../../components/SelectDropdown';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';
import * as css from './AgileBoard.scss';

import getTasks from '../../../actions/Tasks';
import { changeTask, changeTaskUser, startTaskEditing, startTaskChangeUser } from '../../../actions/Task';

const filterTasks = (array, sortedObject) => {
  array.forEach((element) => {
    switch (element.statusId) {
    case 1: sortedObject.new.push(element);
      break;
    case 2: sortedObject.dev.push(element);
      break;
    case 3: sortedObject.dev.push(element);
      break;
    case 4: sortedObject.codeReview.push(element);
      break;
    case 5: sortedObject.codeReview.push(element);
      break;
    case 6: sortedObject.qa.push(element);
      break;
    case 7: sortedObject.qa.push(element);
      break;
    case 8: sortedObject.done.push(element);
      break;
    default: break;
    }
  });
};

const sortTasks = (sortedObject, prefix, section, onChangeStatus, onOpenPerformerModal) => {
  for (const key in sortedObject) {
    sortedObject[key].sort((a, b) => {
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
    });
    sortedObject[key] = sortedObject[key].map((task) => {
      return <TaskCard
        key={`task-${task.id}`}
        task={task}
        prefix={prefix}
        section={section}
        onChangeStatus={onChangeStatus}
        onOpenPerformerModal={onOpenPerformerModal}
      />;
    });
  }
};

const getNewStatus = (oldStatusId, newPhase) => {
  let newStatusId;

  switch (newPhase) {
  case 'New': newStatusId = 1;
    break;
  case 'Dev': newStatusId = 3;
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

const getNewStatusOnClick = (oldStatusId) => {
  let newStatusId;

  if (oldStatusId === 2 || oldStatusId === 4 || oldStatusId === 6) {
    newStatusId = oldStatusId + 1;
  } else if (oldStatusId === 3 || oldStatusId === 5 || oldStatusId === 7) {
    newStatusId = oldStatusId - 1;
  }

  return newStatusId;
};

class AgileBoard extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isSectionOpen: {
        myTasks: true,
        allTasks: true
      },
      isModalOpen: false,
      performer: null,
      filterTags: [],
      changedSprint: null,
      changedTask: null
    };
  }

  toggleSection = (sectionName) => {
    const allSectionsStatus = this.state.isSectionOpen;
    this.setState({
      isSectionOpen: {
        ...allSectionsStatus,
        [sectionName]: !this.state.isSectionOpen[sectionName]
      }
    });
  }

  selectValue = (e, name) => {
    this.setState({[name]: e}, () => {
      this.props.getTasks({
        projectId: this.props.project.id,
        sprintId: this.state.changedSprint
      });
    });
  }

  dropTask = (task, phase) => {
    this.props.changeTask({
      id: task.id,
      statusId: getNewStatus(task.statusId, phase)
    }, 'Status');

    this.props.startTaskEditing('Status');
  }

  changeStatus = (taskId, statusId) => {
    this.props.changeTask({
      id: taskId,
      statusId: getNewStatusOnClick(statusId)
    }, 'Status');

    this.props.startTaskEditing('Status');
  }

  openPerformerModal = (taskId, performerId) => {
    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: taskId
    });
  }

  changePerformer = (performerId) => {
    this.props.changeTaskUser(this.state.changedTask, performerId);
    this.props.startTaskChangeUser();
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 1,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 2
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: true,
        [css.sprintMarker]: true
      })
    });
    return sprints;
  };

  getUsers = () => {
    return this.props.project.users.map((user, i) => ({
      value: user.id,
      label: user.fullNameRu
    }));
  };

  componentDidMount () {
    this.selectValue(0, 'changedSprint');
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.project.id !== nextProps.project.id) this.selectValue(0, 'changedSprint');

    if (!nextProps.StatusIsEditing && this.props.StatusIsEditing) {
      this.selectValue(this.state.changedSprint, 'changedSprint');
    }
    if (!nextProps.UserIsEditing && this.props.UserIsEditing) {
      this.selectValue(this.state.changedSprint, 'changedSprint');
      this.setState({
        isModalOpen: false,
        performer: null,
        changedTask: null
      });
    }

  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  render () {
    const allSorted = {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    };

    filterTasks(this.props.sprintTasks, allSorted);
    sortTasks(allSorted, this.props.project.prefix, 'all', this.changeStatus, this.openPerformerModal);

    const mineSorted = {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    };

    const myTasks = this.props.sprintTasks.filter((task) => {
      return task.performer && task.performer.id === this.props.user.id;
    });

    filterTasks(myTasks, mineSorted);
    sortTasks(mineSorted, this.props.project.prefix, 'mine', this.changeStatus, this.openPerformerModal);

    return (
        <section className={css.agileBoard}>
          {/*<h2 style={{display: 'inline-block'}}>Спринт №1 (01.06.2017 - 30.06.2017)</h2>*/}
          <Row>
            <Col xs>
              <SelectDropdown
                name="changedSprint"
                placeholder="Введите название спринта..."
                multi={false}
                value={this.state.changedSprint}
                onChange={(e) => this.selectValue(e !== null ? e.value : null, 'changedSprint')}
                noResultsText="Нет результатов"
                options={this.getSprints()}
              />
            </Col>
            <Col xs>
              <SelectDropdown
                name="filterTags"
                multi
                placeholder="Введите название тега..."
                backspaceToRemoveMessage="BackSpace для очистки поля"
                value={this.state.filterTags}
                onChange={(e) => this.selectValue(e, 'filterTags')}
                noResultsText="Нет результатов"
                options={[
                  {value: 'develop', label: 'develop'},
                  {value: 'frontend', label: 'frontend'},
                  {value: 'backend', label: 'backend'}
                ]}
              />
            </Col>
          </Row>
          <hr/>
          <h3 onClick={() => this.toggleSection('myTasks')} className={css.taskSectionTitle}>
            <IconArrowDown className={classnames({
              [css.close]: !this.state.isSectionOpen.myTasks,
              [css.open]: this.state.isSectionOpen.myTasks
            })} /> Мои задачи
          </h3>
          {
            this.state.isSectionOpen.myTasks
            ? <Row>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'New'} tasks={mineSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Dev'} tasks={mineSorted.dev}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Code Review'} tasks={mineSorted.codeReview}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'QA'} tasks={mineSorted.qa}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Done'} tasks={mineSorted.done}/>
              </Row>
            : null
          }
          <hr/>
          <h3 onClick={() => this.toggleSection('allTasks')} className={css.taskSectionTitle}>
            <IconArrowDown className={classnames({
              [css.close]: !this.state.isSectionOpen.allTasks,
              [css.open]: this.state.isSectionOpen.allTasks
            })} /> Все задачи
          </h3>
          {
            this.state.isSectionOpen.allTasks
            ? <Row>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'New'} tasks={allSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Dev'} tasks={allSorted.dev} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Code Review'} tasks={allSorted.codeReview} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'QA'} tasks={allSorted.qa} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Done'} tasks={allSorted.done} />
              </Row>
            : null
          }
          <hr/>

          {
            this.state.isModalOpen
            ? <PerformerModal
                defaultUser={this.state.performer}
                onChoose={this.changePerformer}
                onClose={this.closeModal}
                title="Изменить исполнителя задачи"
                users={this.getUsers()}
              />
            : null
          }
        </section>
    );
  }
}

AgileBoard.propTypes = {
  StatusIsEditing: PropTypes.bool,
  UserIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  changeTaskUser: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  project: PropTypes.object,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array,
  startTaskChangeUser: PropTypes.func,
  startTaskEditing: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  sprintTasks: state.Tasks.tasks,
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  StatusIsEditing: state.Task.StatusIsEditing,
  UserIsEditing: state.Task.UserIsEditing,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getTasks,
  changeTask,
  changeTaskUser,
  startTaskEditing,
  startTaskChangeUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AgileBoard);
