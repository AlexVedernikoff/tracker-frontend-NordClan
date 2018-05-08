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
import { VISOR, EXTERNAL_USER, ADMIN } from '../../constants/Roles';

import * as TaskStatuses from '../../constants/TaskStatuses';

import {
  getTask,
  clearError,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
  linkTask,
  unlinkTask,
  removeAttachment,
  uploadAttachments
} from '../../actions/Task';
import getTasks from '../../actions/Tasks';
import { getProjectInfo, openCreateTaskModal, openCreateChildTaskModal } from '../../actions/Project';

import * as css from './TaskPage.scss';
import { getRoles } from '../../actions/Dictionaries';

class TaskPage extends Component {
  static propTypes = {
    DescriptionIsEditing: PropTypes.bool,
    changeTask: PropTypes.func.isRequired,
    children: PropTypes.object,
    clearError: PropTypes.func,
    getProjectInfo: PropTypes.func.isRequired,
    getRoles: PropTypes.func.isRequired,
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
    uploadAttachments: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isTaskModalOpen: false,
      isUnlinkModalOpen: false,
      isLeaveConfirmModalOpen: false,
      unLinkedTask: null,
      isCancelSubTaskModalOpen: false,
      canceledSubTaskId: null,
      closeHasError: false
    };
  }

  componentDidMount() {
    this.props.getRoles();
    this.props.getTask(this.props.params.taskId);
    this.props.getProjectInfo(this.props.params.projectId);
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  }

  routerWillLeave = nextLocation => {
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
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.closeHasError !== this.state.closeHasError) {
      this.setState({
        closeHasError: nextProps.params.closeHasError
      });
    }
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
    this.setState({ isLeaveConfirmModalOpen: false }, () => {
      if (window.location.pathname !== this.state.currentLocation) {
        history.replace(this.state.currentLocation);
      }
    });
  };

  leaveConfirm = () => {
    this.setState({ leaveConfirmed: true }, () => {
      history.push(this.state.nextLocation);
    });
  };

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
    return this.props.projectTasks
      .filter(task => !_.includes(linkedTasksIds, task.id) && task.id !== this.props.task.id)
      .map(task => ({
        value: task.id,
        label: `${this.props.task.project.prefix}-${task.id}. ${task.name}`
      }));
  };

  removeAttachment = attachmentId => {
    this.props.removeAttachment(this.props.task.id, attachmentId);
  };

  uploadAttachments = files => {
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

  handleCloseCancelInfoTaskModal = () => {
    this.props.clearError();
    this.setState({ closeHasError: true });
  };

  handleCancelSubTask = () => {
    const { getTask, changeTask, task } = this.props;
    const { canceledSubTaskId } = this.state;

    changeTask(
      {
        id: canceledSubTaskId,
        statusId: TaskStatuses.CANCELED
      },
      'Status',
      () => {
        getTask(task.id);
      }
    );

    this.handleCloseCancelSubTaskModal();
  };

  render() {
    const { globalRole, task, params } = this.props;
    const isVisor = globalRole === VISOR;
    const isExternal = globalRole === EXTERNAL_USER;
    const projectUrl = task.project ? `/projects/${task.project.id}` : '/';
    const notFoundError =
      task.project && task.project.id !== +params.projectId
        ? {
            message: 'Task not found',
            name: 'NotFoundError',
            status: 404
          }
        : null;
    const httpError = task.error || notFoundError;

    const pmAccess = this.props.project.users.find(user => user.id === this.props.user.id);

    return httpError ? (
      <HttpError error={httpError} />
    ) : (
      <div ref="taskPage" className={css.taskPage}>
        <Row>
          <Col xs={12} sm={8}>
            <TaskHeader
              task={task}
              projectId={params.projectId}
              onChange={this.props.changeTask}
              canEdit={task.statusId !== TaskStatuses.CLOSED}
            />
            <main className={css.main}>
              <Description
                text={{ __html: task.description }}
                headerType="h3"
                id={+params.taskId}
                headerText="Описание:"
                onEditStart={this.props.startTaskEditing}
                onEditFinish={this.props.stopTaskEditing}
                onEditSubmit={this.props.changeTask}
                isEditing={this.props.DescriptionIsEditing}
                canEdit={task.statusId !== TaskStatuses.CLOSED}
              />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments
                attachments={task.attachments}
                removeAttachment={this.removeAttachment}
                uploadAttachments={this.uploadAttachments}
                canEdit={task.statusId !== TaskStatuses.CLOSED}
              />
              {!isExternal ? (
                <RouteTabs style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <Link onlyActiveOnIndex to={`/projects/${params.projectId}/tasks/${params.taskId}`}>
                    Комментарии
                  </Link>
                  <Link to={`/projects/${params.projectId}/tasks/${params.taskId}/history`}>История</Link>
                  {(this.props.globalRole === ADMIN || (pmAccess && (pmAccess.roles.pm || pmAccess.roles.account))) && (
                    <Link to={`/projects/${params.projectId}/tasks/${params.taskId}/time-reports`}>
                      Отчеты по времени
                    </Link>
                  )}
                </RouteTabs>
              ) : null}
              {this.props.children}
            </main>
          </Col>
          <Col xs={12} sm={4}>
            <aside>
              <Details
                task={task}
                sprints={this.props.sprints}
                isExternal={isExternal}
                onChange={this.props.changeTask}
                canEdit={task.statusId !== TaskStatuses.CLOSED}
              />
              {!isVisor ? (
                <button className={css.addTask} onClick={this.props.openCreateTaskModal}>
                  <span>Создать новую задачу</span>
                  <IconPlus style={{ width: 16, height: 16 }} />
                </button>
              ) : null}
              {task.linkedTasks ? (
                <RelatedTasks
                  task={task}
                  type="linkedTasks"
                  onAction={this.handleOpenLinkTaskModal}
                  onDelete={this.handleOpenUnlinkTaskModal}
                />
              ) : null}
              {task.subTasks && !task.parentTask ? (
                <RelatedTasks
                  task={task}
                  type="subTasks"
                  onAction={this.props.openCreateChildTaskModal}
                  onDelete={task.statusId !== TaskStatuses.CANCELED ? this.handleOpenCancelSubTaskModal : null}
                />
              ) : null}
            </aside>
          </Col>
        </Row>
        {this.props.isCreateTaskModalOpen || this.props.isCreateChildTaskModalOpen ? (
          <CreateTaskModal
            selectedSprintValue={task.sprint ? task.sprint.id : 0}
            project={this.props.project}
            parentTaskId={this.props.isCreateChildTaskModalOpen ? task.id : null}
          />
        ) : null}
        {this.state.isTaskModalOpen ? (
          <TaskModal
            onChoose={this.linkTask}
            onClose={this.handleCloseLinkTaskModal}
            title="Связывание задачи"
            tasks={this.getProjectUnlinkedTasks()}
          />
        ) : null}

        {this.state.isUnlinkModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите отвязать задачу?"
            onCancel={this.handleCloseUnlinkTaskModal}
            onConfirm={this.unlinkTask}
          />
        ) : null}

        {this.state.isLeaveConfirmModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите покинуть страницу? Все не сохранённые данные будут потеряны"
            onCancel={this.handleCloseLeaveConfirmModal}
            onConfirm={this.leaveConfirm}
          />
        ) : null}

        {this.state.isCancelSubTaskModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите отменить задачу?"
            onCancel={this.handleCloseCancelSubTaskModal}
            onConfirm={this.handleCancelSubTask}
          />
        ) : null}
        {this.props.hasError === true && this.state.closeHasError !== true ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Нельзя изменять закрытую задачу"
            onCancel={this.handleCloseCancelInfoTaskModal}
            notification
          />
        ) : null}
        <GoBackPanel defaultPreviousUrl={projectUrl} parentRef={this.refs.taskPage} />
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
  globalRole: state.Auth.user.globalRole,
  hasError: state.Task.hasError,
  closeHasError: state.Task.closeHasError,
  user: state.Auth.user
});

const mapDispatchToProps = {
  changeTask,
  getTask,
  clearError,
  getTasks,
  getProjectInfo,
  linkTask,
  openCreateTaskModal,
  openCreateChildTaskModal,
  removeAttachment,
  startTaskEditing,
  stopTaskEditing,
  unlinkTask,
  uploadAttachments,
  getRoles
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);
