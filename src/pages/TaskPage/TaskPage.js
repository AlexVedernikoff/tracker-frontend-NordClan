import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import includes from 'lodash/includes';

import TaskHeader from './TaskHeader';
import Details from './Details';
import ScrollTop from '../../components/ScrollTop';
import RelatedTasks from './RelatedTasks';
import TaskGitlabBranch from './TaskGitlabBranch';
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
import { VISOR, EXTERNAL_USER } from '../../constants/Roles';
import Title from 'react-title-component';

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
import localize from './taskPage.json';
import { checkIsAdminInProject } from '../../utils/isAdmin';
import { isOnlyDevOps } from '../../utils/isDevOps';
import { getDevOpsUsers } from '../../actions/Users';

class TaskPage extends Component {
  static propTypes = {
    DescriptionIsEditing: PropTypes.bool,
    changeTask: PropTypes.func.isRequired,
    children: PropTypes.object,
    clearError: PropTypes.func,
    devOpsUsers: PropTypes.array,
    getDevOpsUsers: PropTypes.func,
    getProjectInfo: PropTypes.func.isRequired,
    getRoles: PropTypes.func.isRequired,
    getTask: PropTypes.func.isRequired,
    getTasks: PropTypes.func.isRequired,
    globalRole: PropTypes.string.isRequired,
    hasError: PropTypes.bool,
    isCreateChildTaskModalOpen: PropTypes.bool,
    isCreateTaskModalOpen: PropTypes.bool,
    lang: PropTypes.string,
    linkTask: PropTypes.func.isRequired,
    location: PropTypes.object,
    openCreateChildTaskModal: PropTypes.func.isRequired,
    openCreateTaskModal: PropTypes.func.isRequired,
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired,
      closeHasError: PropTypes.bool
    }),
    project: PropTypes.object,
    projectTasks: PropTypes.array,
    removeAttachment: PropTypes.func,
    route: PropTypes.object,
    router: PropTypes.object,
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
    if (!this.props.devOpsUsers) {
      this.props.getDevOpsUsers();
    }
  }

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
    this.setState({ leaveConfirmed: true, isLeaveConfirmModalOpen: false }, () => {
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
      .filter(
        task =>
          task.id !== this.props.task.id &&
          !includes(linkedTasksIds, task.id) &&
          task.parentId !== this.props.task.id &&
          task.id !== this.props.task.parentId
      )
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
    const { task } = this.props;
    const { canceledSubTaskId } = this.state;

    this.props.changeTask(
      {
        id: canceledSubTaskId,
        statusId: TaskStatuses.CANCELED
      },
      'Status',
      () => {
        this.props.getTask(task.id);
      }
    );

    this.handleCloseCancelSubTaskModal();
  };

  render() {
    const { globalRole, task, params, lang, user, project } = this.props;
    const isProjectAdmin = checkIsAdminInProject(user, project.id);
    const isVisor = globalRole === VISOR;
    const isExternal = globalRole === EXTERNAL_USER;
    const projectUrl = task.project ? `/projects/${task.project.id}` : '/';
    const notFoundError =
      task.project && task.project.id !== +params.projectId
        ? {
            message: localize[lang].NOT_FOUND_ERROR,
            name: 'NotFoundError',
            status: 404
          }
        : null;
    const httpError = task.error || notFoundError;
    const links = [
      <Link
        key={`/projects/${params.projectId}/tasks/${params.taskId}`}
        onlyActiveOnIndex
        to={`/projects/${params.projectId}/tasks/${params.taskId}`}
      >
        {localize[lang].COMMENTS}
      </Link>,
      <Link
        key={`/projects/${params.projectId}/tasks/${params.taskId}`}
        to={`/projects/${params.projectId}/tasks/${params.taskId}/history`}
      >
        {localize[lang].HISTORY}
      </Link>
    ];
    if (isProjectAdmin) {
      links.push(
        <Link
          key={`/projects/${params.projectId}/tasks/${params.taskId}`}
          to={`/projects/${params.projectId}/tasks/${params.taskId}/time-reports`}
        >
          {localize[lang].TIME_REPORTS}
        </Link>
      );
    }

    return httpError ? (
      <HttpError error={httpError} />
    ) : (
      <div ref="taskPage" className={css.taskPage}>
        <Title render={`[Epic] - ${project.prefix}-${task.id} ${task.name}`} />
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
                headerText={localize[lang].DESCRIPTION}
                onEditStart={this.props.startTaskEditing}
                onEditFinish={this.props.stopTaskEditing}
                onEditSubmit={this.props.changeTask}
                isEditing={this.props.DescriptionIsEditing}
                canEdit={task.statusId !== TaskStatuses.CLOSED}
              />
              <hr />
              <h3>{localize[lang].ATTACHED_FILES}</h3>
              <Attachments
                attachments={task.attachments}
                removeAttachment={this.removeAttachment}
                uploadAttachments={this.uploadAttachments}
                canEdit={task.statusId !== TaskStatuses.CLOSED}
              />
              {!isExternal ? <RouteTabs style={{ marginTop: '2rem', marginBottom: '2rem' }}>{links}</RouteTabs> : null}
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
              {!isVisor && !isOnlyDevOps(user, project.id) ? (
                <button className={css.addTask} onClick={this.props.openCreateTaskModal}>
                  <span>{localize[lang].CREATE_NEW_TASK}</span>
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
              {this.props.user.globalRole !== EXTERNAL_USER ? (
                <TaskGitlabBranch taskId={this.props.params.taskId} projectId={params.projectId} />
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
            title={localize[lang].BINDING_TASK}
            tasks={this.getProjectUnlinkedTasks()}
          />
        ) : null}

        {this.state.isUnlinkModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].CONFIRM_UNTIE_TASK}
            onCancel={this.handleCloseUnlinkTaskModal}
            onConfirm={this.unlinkTask}
          />
        ) : null}

        {this.state.isLeaveConfirmModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].CONFIRM_LEAVE_PAGE}
            onCancel={this.handleCloseLeaveConfirmModal}
            onConfirm={this.leaveConfirm}
          />
        ) : null}

        {this.state.isCancelSubTaskModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].CONFIRM_CANCEL_TASK}
            onCancel={this.handleCloseCancelSubTaskModal}
            onConfirm={this.handleCancelSubTask}
          />
        ) : null}
        {this.props.hasError && !this.state.closeHasError ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].ERROR_CHANGE_PRIVATE_TASK}
            onCancel={this.handleCloseCancelInfoTaskModal}
            notification
          />
        ) : null}
        <ScrollTop />
        <GoBackPanel defaultPreviousUrl={projectUrl} parentRef={this.refs.taskPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devOpsUsers: state.UserList.devOpsUsers,
  project: state.Project.project,
  projectTasks: state.Tasks.tasks,
  task: state.Task.task,
  DescriptionIsEditing: state.Task.DescriptionIsEditing,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  isCreateChildTaskModalOpen: state.Project.isCreateChildTaskModalOpen,
  globalRole: state.Auth.user.globalRole,
  hasError: state.Task.hasError,
  closeHasError: state.Task.closeHasError,
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  changeTask,
  getTask,
  clearError,
  getTasks,
  getProjectInfo,
  getDevOpsUsers,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskPage);
