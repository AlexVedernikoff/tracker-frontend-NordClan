import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import TaskHeader from './TaskHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import Attachments from '../../components/Attachments';
import Description from '../../components/Description';
import RouteTabs from '../../components/RouteTabs';
import CreateTask from '../../pages/ProjectPage/CreateTask';
import { getTask, startTaskEditing, stopTaskEditing, changeTask, changeTaskUser} from '../../actions/Task';
import {
  getProjectInfo,
  openCreateTaskModal,
  closeCreateTaskModal,
  createTask
} from '../../actions/Project';

import * as css from './TaskPage.scss';

class TaskPage extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getTask(this.props.params.taskId);
    this.props.getProjectInfo(this.props.params.projectId);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.taskId !== this.props.params.taskId) {
      this.props.getTask(nextProps.params.taskId);
    }

    if (nextProps.params.projectId !== this.props.params.projectId) {
      this.props.getProjectInfo(this.props.params.projectId);
    }
  }

  handleModal = () => {
    if (this.props.isCreateTaskModalOpen) {
      this.props.closeCreateTaskModal();
    } else {
      this.props.openCreateTaskModal();
    }
  };

  openCreateChildModal = () => {
    this.setState({
      isCreateTaskModalOpen: true
    });
  }

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

  render () {
    // Mocks

    const task = {
      id: 1,
      name: 'UI. Подготовка к демонстрации. Краткая проверка функционала',
      description:
        'Описание задачи, которое довольно часто может составлять пару предложений, а то и вовсе отсутствовать.',
      projectName: 'MakeTalents',
      projectId: 1,
      sprint: 'Спринт 1',
      tags: ['UI', 'ReFactor', 'Demo'],
      creator: {
        name: 'Виссарион Одноклассница'
      },
      owner: {
        name: 'Андрей Юдин'
      },
      parentTask: {
        name: 'UI: Add to gulp build tasks for css and js minification',
        prefix: ''
      }
    };

    return (
      <div id="task-page">
        <Row>
          <Col xs={8}>
            <TaskHeader task={this.props.task} projectId={this.props.params.projectId} onChange={this.props.changeTask} onChangeUser={this.props.changeTaskUser} />
            <main className={css.main}>
              <Description
                text={{ __html: this.props.task.description }}
                headerType="h3"
                id={this.props.params.taskId}
                headerText="Описание:"
                onEditStart={this.props.startTaskEditing}
                onEditFinish={this.props.stopTaskEditing}
                onEditSubmit={this.props.changeTask}
                isEditing={this.props.DescriptionIsEditing}
              />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments task={task} />
              <RouteTabs style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Link
                  to={`/projects/${task.projectId}/tasks/${task.id}/comments`}
                >
                  Комментарии
                </Link>
                <Link
                  to={`/projects/${task.projectId}/tasks/${task.id}/history`}
                >
                  История
                </Link>
              </RouteTabs>
              {this.props.children}
            </main>
          </Col>
          <Col xs={4}>
            <aside>
              <Details task={this.props.task} onChangeUser={this.props.changeTaskUser} />
              {
                this.props.task.linkedTasks
                ? <RelatedTasks task={this.props.task} type="linkedTasks" />
                : null
              }
              {
                this.props.task.subTasks && !this.props.task.parentTask
                ? <RelatedTasks task={this.props.task} type="subTasks" onAction={this.handleModal} />
                : null
              }
            </aside>
          </Col>
        </Row>
        { this.props.task.project
          ? <CreateTask
              isOpen={this.props.isCreateTaskModalOpen}
              onRequestClose={this.handleModal}
              sprintsList={this.getSprints()}
              selectedSprintValue={this.props.task.sprint ? this.props.task.sprint.id : 0}
              onSubmit={this.props.createTask}
              project={this.props.task.project}
              parentTaskId={this.props.task.id}
            />
            : null
        }
      </div>
    );
  }
}

TaskPage.propTypes = {
  DescriptionIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  changeTaskUser: PropTypes.func.isRequired,
  children: PropTypes.object,
  closeCreateTaskModal: PropTypes.func,
  createTask: PropTypes.func.isRequired,
  getTask: PropTypes.func.isRequired,
  getProjectInfo: PropTypes.func.isRequired,
  isCreateTaskModalOpen: PropTypes.bool,
  openCreateTaskModal: PropTypes.func,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }),
  sprints: PropTypes.array,
  startTaskEditing: PropTypes.func.isRequired,
  stopTaskEditing: PropTypes.func.isRequired,
  task: PropTypes.object
};

const mapStateToProps = state => ({
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  sprints: state.Project.project.sprints,
  task: state.Task.task,
  DescriptionIsEditing: state.Task.DescriptionIsEditing
});

const mapDispatchToProps = {
  getTask,
  getProjectInfo,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
  changeTaskUser,
  openCreateTaskModal,
  closeCreateTaskModal,
  createTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);
