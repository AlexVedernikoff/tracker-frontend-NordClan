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
import Button from '../../../components/Button';
import CreateTaskModal from '../../../components/CreateTaskModal';
import { IconArrowDown } from '../../../components/Icons';
import * as css from './AgileBoard.scss';

import getTasks from '../../../actions/Tasks';
import { changeTask, changeTaskUser, startTaskEditing, startTaskChangeUser } from '../../../actions/Task';
import { openCreateTaskModal } from '../../../actions/Project';

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

const sortTasksAndCreateCard = (sortedObject, section, onChangeStatus, onOpenPerformerModal, myTaskBoard) => {
  for (const key in sortedObject) {
    sortedObject[key].sort((a, b) => {
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
    });
    sortedObject[key] = sortedObject[key].map((task) => {
      return <TaskCard
        key={`task-${task.id}`}
        task={task}
        section={section}
        onChangeStatus={onChangeStatus}
        onOpenPerformerModal={onOpenPerformerModal}
        myTaskBoard = {myTaskBoard}
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
        myTasks: false,
        allTasks: false
      },
      isModalOpen: false,
      performer: null,
      filterTags: [],
      changedSprint: null,
      changedTask: null
    };
  }

  componentDidMount () {
    this.selectValue(this.getCurrentSprint(this.props.sprints), 'changedSprint');
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.sprints !== nextProps.sprints) this.selectValue(this.getCurrentSprint(nextProps.sprints), 'changedSprint');

    if (nextProps.sprintTasks.length) {
      this.setState({
        isSectionOpen: {
          myTasks: true,
          allTasks: true
        }
      });
    } else {
      this.setState({
        isSectionOpen: {
          myTasks: false,
          allTasks: false
        }
      });
    }

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

  toggleSection = (sectionName) => {
    const allSectionsStatus = this.state.isSectionOpen;
    this.setState({
      isSectionOpen: {
        ...allSectionsStatus,
        [sectionName]: !this.state.isSectionOpen[sectionName]
      }
    });
  };

  selectValue = (e, name) => {
    this.setState({[name]: e}, () => {
      const options = !this.props.myTaskBoard ? {
        projectId: this.props.project.id,
        sprintId: this.state.changedSprint
      } : {
        performerId: this.props.user.id
      };

      this.props.getTasks(options);
    });
  };

  dropTask = (task, phase) => {
    this.props.changeTask({
      id: task.id,
      statusId: getNewStatus(task.statusId, phase)
    }, 'Status');

    this.props.startTaskEditing('Status');
  };

  changeStatus = (taskId, statusId) => {
    this.props.changeTask({
      id: taskId,
      statusId: getNewStatusOnClick(statusId)
    }, 'Status');

    this.props.startTaskEditing('Status');
  };

  openPerformerModal = (taskId, performerId) => {
    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: taskId
    });
  };

  changePerformer = (performerId) => {
    this.props.changeTaskUser(this.state.changedTask, performerId);
    this.props.startTaskChangeUser();
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  getCurrentSprint = sprints => {
    const currentSprints = sprints.filter(sprint =>
      sprint.statusId === 2 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]')
    );
    return currentSprints.length ? currentSprints[0].id : 0;
  };

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${sprint.factFinishDate
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

  getUsers = (e) => {
    return !this.props.myTaskBoard ? this.props.project.users.map((user, i) => ({
      value: user.id,
      label: user.fullNameRu
    })) : null;
  };

  render () {
    const allSorted = {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    };

    filterTasks(this.props.sprintTasks, allSorted);
    sortTasksAndCreateCard(allSorted, 'all', this.changeStatus, this.openPerformerModal);

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
    sortTasksAndCreateCard(mineSorted, 'mine', this.changeStatus, this.openPerformerModal, this.props.myTaskBoard);

    return (
        <section className={css.agileBoard}>
          {!this.props.myTaskBoard ? <Row className={css.filtersRow}>
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
            <Button
              onClick={this.props.openCreateTaskModal}
              type="primary"
              text="Создать задачу"
              icon="IconPlus"
              name="right"
              style={{ marginLeft: 16, marginRight: 8 }}
            />
          </Row> : null}
          {!this.props.myTaskBoard ? <Row>
            <Col xs>
              <SelectDropdown
                name="filterTags"
                multi
                placeholder="Введите название тега..."
                backspaceToRemoveMessage=""
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
          </Row> : null}
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
          {!this.props.myTaskBoard ? <div>
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
            </div> : null}

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
          <CreateTaskModal
            selectedSprintValue={this.state.changedSprint || 0}
            project={this.props.project}
          />
        </section>
    );
  }
}

AgileBoard.propTypes = {
  changeTask: PropTypes.func.isRequired,
  changeTaskUser: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  myTaskBoard: PropTypes.bool,
  openCreateTaskModal: PropTypes.func.isRequired,
  project: PropTypes.object,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array,
  startTaskChangeUser: PropTypes.func,
  startTaskEditing: PropTypes.func,
  StatusIsEditing: PropTypes.bool,
  UserIsEditing: PropTypes.bool,
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
  startTaskChangeUser,
  openCreateTaskModal
};

export default connect(mapStateToProps, mapDispatchToProps)(AgileBoard);
