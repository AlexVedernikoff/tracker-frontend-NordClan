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
import { IconPlus } from '../../components/Icons';
import Description from '../../components/Description';
import RouteTabs from '../../components/RouteTabs';
import TaskModal from '../../components/TaskModal';
import ConfirmModal from '../../components/ConfirmModal';
import GoBackPanel from '../../components/GoBackPanel';
import CreateTaskModal from '../../components/CreateTaskModal';
import HttpError from '../../components/HttpError';
import { history } from '../../History';
import { VISOR } from '../../constants/Roles';

import * as TaskStatuses from '../../constants/TaskStatuses';

import {
  getTask,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
  linkTask,
  unlinkTask,
  removeAttachment,
  uploadAttachments
} from '../../actions/Task';
import getTasks from '../../actions/Tasks';
import {
  getProjectInfo,
  openCreateTaskModal,
  openCreateChildTaskModal
} from '../../actions/Project';

import * as css from './TaskPage.scss';

class TaskPage extends Component {
  static propTypes = {
    DescriptionIsEditing: PropTypes.bool,
    changeTask: PropTypes.func.isRequired,
    children: PropTypes.object,
    getProjectInfo: PropTypes.func.isRequired,
    getTask: PropTypes.func.isRequired,
    getTasks: PropTypes.func.isRequired,
    globalRole: PropTypes.string.isRequired,
    isCreateChildTaskModalOpen: PropTypes.bool,
    isCreateTaskModalOpen: PropTypes.bool,
    linkTask: PropTypes.func.isRequired,
    openCreateChildTaskModal: PropTypes.func.isRequired,
    openCreateTaskModal: PropTypes.func.isRequired,
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired
    }),
    project: PropTypes.object,
    projectTasks: PropTypes.array,
    removeAttachment: PropTypes.func,
    sprints: PropTypes.array,
    startTaskEditing: PropTypes.func.isRequired,
    stopTaskEditing: PropTypes.func.isRequired,
    task: PropTypes.object,
    unlinkTask: PropTypes.func.isRequired,
    uploadAttachments: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isTaskModalOpen: false,
      isUnlinkModalOpen: false,
      isLeaveConfirmModalOpen: false,
      unLinkedTask: null,
      isCancelSubTaskModalOpen: false,
      canceledSubTaskId: null
    };
  }

  componentDidMount () {
    this.props.getTask(this.props.params.taskId);
    this.props.getProjectInfo(this.props.params.projectId);
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  }

  routerWillLeave = (nextLocation) => {
    if (this.props.DescriptionIsEditing) {
      if (this.state.leaveConfirmed) return true;
      this.setState({
        isLeaveConfirmModalOpen: true,
        nextLocation: nextLocation.pathname,
        currentLocation: this.props.location.pathname
      });
      return false;
    } else {
      return true;
    }
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
  };

  unlinkTask = () => {
    this.props.unlinkTask(this.props.params.taskId, this.state.unLinkedTask);
    this.handleCloseUnlinkTaskModal();
  };

  handleCloseLeaveConfirmModal = () => {
    this.setState({isLeaveConfirmModalOpen: false}, () => {
      if (window.location.pathname !== this.state.currentLocation) {
        history.replace(this.state.currentLocation);
      }
    });
  }

  leaveConfirm = () => {
    this.setState({leaveConfirmed: true}, () => {
      history.push(this.state.nextLocation);
    });
  }

  handleOpenLinkTaskModal = () => {
    this.props.getTasks({
      projectId: this.props.params.projectId
    });
    this.setState({
      isTaskModalOpen: true
    });
  };

  handleCloseLinkTaskModal = () => {
    this.setState({
      isTaskModalOpen: false
    });
  };

  handleCloseUnlinkTaskModal = () => {
    this.setState({
      isUnlinkModalOpen: false
    });
  };

  handleOpenUnlinkTaskModal = unlinkedTaskId => {
    this.setState({
      isUnlinkModalOpen: true,
      unLinkedTask: unlinkedTaskId
    });
  };

  getProjectUnlinkedTasks = () => {
    const linkedTasksIds = this.props.task.linkedTasks.map(task => task.id);
    return this.props.projectTasks.filter(task => !_.includes(linkedTasksIds, task.id) && task.id !== this.props.task.id).map(task => ({
      value: task.id,
      label: `${this.props.task.project.prefix}-${task.id}. ${task.name}`
    }));
  };

  removeAttachment = (attachmentId) => {
    this.props.removeAttachment(this.props.task.id, attachmentId);
  };

  uploadAttachments = (files) => {
    this.props.uploadAttachments(this.props.task.id, files);
  };

  handleOpenCancelSubTaskModal = id => {
    this.setState({
      isCancelSubTaskModalOpen: true,
      canceledSubTaskId: id
    });
  };

  handleCloseCancelSubTaskModal = () => {
    this.setState({
      isCancelSubTaskModalOpen: false,
      canceledSubTaskId: null
    });
  };

  handleCancelSubTask = () => {
    this.props.changeTask({
      id: this.state.canceledSubTaskId,
      statusId: TaskStatuses.CANCELED
    },
    'Status');
    this.handleCloseCancelSubTaskModal();
  };

  render () {
    const { globalRole } = this.props;
    const isVisor = globalRole === VISOR;
    let projectUrl = '/';
    if (this.props.task.project) projectUrl = `/projects/${this.props.task.project.id}`;

    return (this.props.task.error) ? (<HttpError error={this.props.task.error}/>) : (
      <div ref="taskPage" className={css.taskPage}>
        <Row>
          <Col xs={12} sm={8}>
            <TaskHeader
              task={this.props.task}
              projectId={this.props.params.projectId}
              onChange={this.props.changeTask}
              canEdit={this.props.task.statusId !== TaskStatuses.CLOSED}
            />
            <main className={css.main}>
              <Description
                text={{ __html: this.props.task.description }}
                headerType="h3"
                id={+this.props.params.taskId}
                headerText="Описание:"
                onEditStart={this.props.startTaskEditing}
                onEditFinish={this.props.stopTaskEditing}
                onEditSubmit={this.props.changeTask}
                isEditing={this.props.DescriptionIsEditing}
                canEdit={this.props.task.statusId !== TaskStatuses.CLOSED}
              />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments
                attachments={this.props.task.attachments}
                removeAttachment={this.removeAttachment}
                uploadAttachments={this.uploadAttachments}
                canEdit={this.props.task.statusId !== TaskStatuses.CLOSED}
              />
              <RouteTabs style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Link
                  onlyActiveOnIndex
                  to={`/projects/${this.props.params.projectId}/tasks/${this.props.params.taskId}`}
                >
                  Комментарии
                </Link>
                <Link
                  to={`/projects/${this.props.params.projectId}/tasks/${this.props.params.taskId}/history`}
                >
                  История
                </Link>
              </RouteTabs>
              {this.props.children}
            </main>
          </Col>
          <Col xs={12} sm={4}>
            <aside>
              <Details
                task={this.props.task}
                sprints={this.props.sprints}
                onChange={this.props.changeTask}
                canEdit={this.props.task.statusId !== TaskStatuses.CLOSED}
              />
              {
                !isVisor
                  ? <button className={css.addTask} onClick={this.props.openCreateTaskModal}>
                      <span>Создать новую задачу</span>
                      <IconPlus style={{width: 16, height: 16}}/>
                    </button>
                  : null
              }
              {
                this.props.task.linkedTasks
                  ? <RelatedTasks task={this.props.task} type="linkedTasks" onAction={this.handleOpenLinkTaskModal}
                    onDelete={this.handleOpenUnlinkTaskModal} />
                  : null
              }
              {
                this.props.task.subTasks && !this.props.task.parentTask
                  ? <RelatedTasks
                    task={this.props.task}
                    type="subTasks"
                    onAction={this.props.openCreateChildTaskModal}
                    onDelete={this.props.task.statusId !== TaskStatuses.CANCELED
                      ? this.handleOpenCancelSubTaskModal
                      : null
                    }
                  />
                  : null
              }
            </aside>
          </Col>
        </Row>
        {
          this.props.isCreateTaskModalOpen || this.props.isCreateChildTaskModalOpen
            ? <CreateTaskModal
              selectedSprintValue={this.props.task.sprint ? this.props.task.sprint.id : 0}
              project={this.props.project}
              parentTaskId={this.props.isCreateChildTaskModalOpen ? this.props.task.id : null}
            />
            : null
        }
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

        { this.state.isLeaveConfirmModalOpen
          ? <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите покинуть страницу? Все не сохранённые данные будут потеряны"
            onCancel={this.handleCloseLeaveConfirmModal}
            onConfirm={this.leaveConfirm}
          />
          : null
        }

        {
          this.state.isCancelSubTaskModalOpen
            ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите отменить задачу?"
              onCancel={this.handleCloseCancelSubTaskModal}
              onConfirm={this.handleCancelSubTask}
            />
            : null
        }
        <GoBackPanel
          defaultPreviousUrl={projectUrl}
          parentRef={this.refs.taskPage}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  projectTasks: state.Tasks.tasks,
  task: state.Task.task,
  DescriptionIsEditing: state.Task.DescriptionIsEditing,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  isCreateChildTaskModalOpen: state.Project.isCreateChildTaskModalOpen,
  globalRole: state.Auth.user.globalRole
});

const mapDispatchToProps = {
  changeTask,
  getTask,
  getTasks,
  getProjectInfo,
  linkTask,
  openCreateTaskModal,
  openCreateChildTaskModal,
  removeAttachment,
  startTaskEditing,
  stopTaskEditing,
  unlinkTask,
  uploadAttachments
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);
