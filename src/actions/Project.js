import axios from 'axios';
import * as ProjectActions from '../constants/Project';
import { API_URL } from '../constants/Settings';
import { history } from '../Router';
import { showNotification } from './Notifications';
import { startLoading, finishLoading } from './Loading';
import getPlanningTasks from './PlanningTasks';
import { getTask } from './Task';

const gettingProjectInfoStart = () => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_START
});

const gettingProjectInfoSuccess = project => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS,
  project: project
});

const gettingProjectUsersStart = () => ({
  type: ProjectActions.PROJECT_USERS_RECEIVE_START
});

const gettingProjectUsersSuccess = users => ({
  type: ProjectActions.PROJECT_USERS_RECEIVE_SUCCESS,
  users
});

const startProjectChange = () => ({
  type: ProjectActions.PROJECT_CHANGE_START
});

const projectChangeSuccess = response => ({
  type: ProjectActions.PROJECT_CHANGE_SUCCESS,
  changedFields: response
});

export const StartEditing = target => ({
  type: ProjectActions.EDIT_START,
  target: target
});

export const StopEditing = target => ({
  type: ProjectActions.EDIT_FINISH,
  target: target
});

export const openCreateTaskModal = () => ({
  type: ProjectActions.OPEN_CREATE_TASK_MODAL
});

export const closeCreateTaskModal = () => ({
  type: ProjectActions.CLOSE_CREATE_TASK_MODAL
});

const createTaskRequestStart = () => ({
  type: ProjectActions.TASK_CREATE_REQUEST_START
});

const createTaskRequestSuccess = () => ({
  type: ProjectActions.TASK_CREATE_REQUEST_SUCCESS
});

const getProjectInfo = id => {
  const URL = `${API_URL}/project/${id}`;

  return dispatch => {
    dispatch(gettingProjectInfoStart());
    dispatch(startLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(gettingProjectInfoSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

const getProjectUsers = id => {
  const URL = `${API_URL}/project/${id}/users`;

  return dispatch => {
    dispatch(gettingProjectUsersStart());
    dispatch(startLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(gettingProjectUsersSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

const ChangeProject = (ChangedProperties, target) => {
  if (!ChangedProperties.id) {
    return;
  }

  const URL = `${API_URL}/project/${ChangedProperties.id}`;

  return dispatch => {
    dispatch(startProjectChange());
    dispatch(startLoading());

    axios
      .put(URL, ChangedProperties, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(projectChangeSuccess(response.data));
          dispatch(finishLoading());
          dispatch(StopEditing(target));
        }
      });
  };
};

const createTask = (task, openTaskPage, callee) => {
  if (!task.name || !task.projectId || !task.statusId || !task.typeId) {
    return;
  }

  const URL = `${API_URL}/task`;

  return dispatch => {
    dispatch(startLoading());
    dispatch(createTaskRequestStart());

    axios
      .post(URL, task, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(finishLoading());
          dispatch(createTaskRequestSuccess());
          dispatch(getTask(task.parentId));
          dispatch(closeCreateTaskModal());
          dispatch(getProjectInfo(task.projectId));
          if (callee) {
            dispatch(getPlanningTasks(callee, { sprintId: task.sprintId || 0, projectId: task.projectId }));
          }

          if (openTaskPage) {
            history.push(
              `/projects/${task.projectId}/tasks/${response.data.id}`
            );
          }
        }
      });
  };
};

export { getProjectInfo, getProjectUsers, ChangeProject, createTask };
