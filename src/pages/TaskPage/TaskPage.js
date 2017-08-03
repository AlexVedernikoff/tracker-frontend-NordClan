import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

import TaskHeader from './TaskHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import Attachments from '../../components/Attachments';
import Description from '../../components/Description';
import RouteTabs from '../../components/RouteTabs';
import TaskModal from '../../components/TaskModal';
import ConfirmModal from '../../components/ConfirmModal';
import CreateTaskModal from '../../components/CreateTaskModal';
import { getTask,
        startTaskEditing,
        stopTaskEditing,
        changeTask,
        changeTaskUser,
        linkTask,
        unlinkTask
} from '../../actions/Task';
import getTasks from '../../actions/Tasks';
import {
  getProjectInfo,
  openCreateTaskModal
} from '../../actions/Project';

import * as css from './TaskPage.scss';

class TaskPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isTaskModalOpen: false,
      isUnlinkModalOpen: false,
      unLinkedTask: null
    };
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

  linkTask = linkedTaskId => {
    this.props.linkTask(this.props.params.taskId, linkedTaskId.toString());
    this.handleCloseLinkTaskModal();
  }

  unlinkTask = () => {
    this.props.unlinkTask(this.props.params.taskId, this.state.unLinkedTask);
    this.handleCloseUnlinkTaskModal();
  }

  handleOpenLinkTaskModal = () => {
    this.props.getTasks({
      projectId: this.props.params.projectId
    });
    this.setState({
      isTaskModalOpen: true
    });
  }

  handleCloseLinkTaskModal = () => {
    this.setState({
      isTaskModalOpen: false
    });
  }

  handleCloseUnlinkTaskModal = () => {
    this.setState({
      isUnlinkModalOpen: false
    });
  }

  handleOpenUnlinkTaskModal = unlinkedTaskId => {
    this.setState({
      isUnlinkModalOpen: true,
      unLinkedTask: unlinkedTaskId
    });
  }

  getProjectUnlinkedTasks = () => {
    const linkedTasksIds = this.props.task.linkedTasks.map(task => task.id);
    return this.props.projectTasks.filter(task => !_.includes(linkedTasksIds, task.id)).map(task => ({
      value: task.id,
      label: `${this.props.task.project.prefix}-${task.id}. ${task.name}`
    }));
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
                ? <RelatedTasks task={this.props.task} type="linkedTasks" onAction={this.handleOpenLinkTaskModal} onDelete={this.handleOpenUnlinkTaskModal} />
                : null
              }
              {
                this.props.task.subTasks && !this.props.task.parentTask
                ? <RelatedTasks task={this.props.task} type="subTasks" onAction={this.props.openCreateTaskModal} />
                : null
              }
            </aside>
          </Col>
        </Row>
        <CreateTaskModal
          selectedSprintValue={this.props.task.sprint ? this.props.task.sprint.id : 0}
          project={this.props.project}
          parentTaskId={this.props.task.id}
        />
        {
          this.state.isTaskModalOpen
          ? <TaskModal
              onChoose={this.linkTask}
              onClose={this.handleCloseLinkTaskModal}
              title="Связывание задачи"
              tasks={this.getProjectUnlinkedTasks()}
            />
          : null
        }

        { this.state.isUnlinkModalOpen
          ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите отвязать задачу?"
              onCancel={this.handleCloseUnlinkTaskModal}
              onConfirm={this.unlinkTask}
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
  getProjectInfo: PropTypes.func.isRequired,
  getTask: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  linkTask: PropTypes.func.isRequired,
  openCreateTaskModal: PropTypes.func.isRequired,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }),
  project: PropTypes.object,
  projectTasks: PropTypes.array,
  startTaskEditing: PropTypes.func.isRequired,
  stopTaskEditing: PropTypes.func.isRequired,
  task: PropTypes.object,
  unlinkTask: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.Project.project,
  projectTasks: state.Tasks.tasks,
  task: state.Task.task,
  DescriptionIsEditing: state.Task.DescriptionIsEditing
});

const mapDispatchToProps = {
  getTask,
  getTasks,
  getProjectInfo,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
  changeTaskUser,
  openCreateTaskModal,
  linkTask,
  unlinkTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);
