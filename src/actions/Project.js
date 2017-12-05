import axios from 'axios';
import * as ProjectActions from '../constants/Project';
import { API_URL } from '../constants/Settings';
import { BACKLOG_ID } from '../constants/Sprint';
import { history } from '../History';
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

const gettingProjectInfoFail = error => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_FAIL,
  error: error
});

const gettingProjectUsersStart = () => ({
  type: ProjectActions.PROJECT_USERS_RECEIVE_START
});

const gettingProjectUsersSuccess = users => ({
  type: ProjectActions.PROJECT_USERS_RECEIVE_SUCCESS,
  users
});

const gettingProjectSprintsStart = () => ({
  type: ProjectActions.PROJECT_SPRINTS_RECEIVE_START
});

const gettingProjectSprintsSuccess = sprints => ({
  type: ProjectActions.PROJECT_SPRINTS_RECEIVE_SUCCESS,
  sprints
});

const startProjectChange = () => ({
  type: ProjectActions.PROJECT_CHANGE_START
});

const projectChangeSuccess = response => ({
  type: ProjectActions.PROJECT_CHANGE_SUCCESS,
  changedFields: response
});

const getProjectHistoryStart = () => ({
  type: ProjectActions.GET_PROJECT_HISTORY_REQUEST_SENT
});

const getProjectHistorySuccess = historyData => ({
  type: ProjectActions.GET_PROJECT_HISTORY_REQUEST_SUCCESS,
  data: historyData
});

export const startEditing = target => ({
  type: ProjectActions.EDIT_START,
  target: target
});

export const stopEditing = target => ({
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

const createTaskRequestError = () => ({
  type: ProjectActions.TASK_CREATE_REQUEST_ERROR
});

export const openPortfolioModal = () => ({
  type: ProjectActions.OPEN_SET_PORTFOLIO_MODAL
});

export const closePortfolioModal = () => ({
  type: ProjectActions.CLOSE_SET_PORTFOLIO_MODAL
});

const createTaskRequestSuccess = (projectId, sprintId, taskId, task) => ({
  type: ProjectActions.TASK_CREATE_REQUEST_SUCCESS,
  projectId,
  sprintId,
  taskId,
  task
});

const bindUserToProjectStart = () => ({
  type: ProjectActions.BIND_USER_TO_PROJECT_START
});

const unbindUserToProjectStart = () => ({
  type: ProjectActions.UNBIND_USER_TO_PROJECT_START
});

const bindUserToProjectsSuccess = users => ({
  type: ProjectActions.BIND_USER_TO_PROJECT_SUCCESS,
  users: users
});
const unbindUserToProjectsSuccess = users => ({
  type: ProjectActions.UNBIND_USER_TO_PROJECT_SUCCESS,
  users: users
});

export const bindUserToProject = (projectId, userId, rolesIds) => {
  const URL = `${API_URL}/project/${projectId}/users`;

  return dispatch => {
    dispatch(bindUserToProjectStart());
    dispatch(startLoading());
    axios
      .post(URL, {
        userId: userId,
        rolesIds: rolesIds || '0'
      })
      .then(response => {
        if (response.data) {
          dispatch(bindUserToProjectsSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export const unbindUserToProject = (projectId, userId) => {
  const URL = `${API_URL}/project/${projectId}/users/${userId}`;

  return dispatch => {
    dispatch(unbindUserToProjectStart());
    dispatch(startLoading());
    axios
      .delete(URL)
      .then(response => {
        if (response.data) {
          dispatch(unbindUserToProjectsSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

const getProjectInfo = id => {
  const URL = `${API_URL}/project/${id}`;

  return dispatch => {
    dispatch(gettingProjectInfoStart());
    dispatch(startLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(gettingProjectInfoFail(error.response.data));
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

const getProjectSprints = id => {
  const URL = `${API_URL}/sprint`;

  return dispatch => {
    dispatch(gettingProjectSprintsStart());
    dispatch(startLoading());
    axios
      .get(URL, {
        params: {
          projectId: id,
          fields: 'id,name,factFinishDate'
        }
      }, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(gettingProjectSprintsSuccess(response.data.data));
          dispatch(finishLoading());
        }
      });
  };
};

const changeProject = (changedProperties, target) => {
  if (!changedProperties.id) {
    return;
  }

  const URL = `${API_URL}/project/${changedProperties.id}`;

  return dispatch => {
    dispatch(startProjectChange());
    dispatch(startLoading());

    axios
      .put(URL, changedProperties, {
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
          dispatch(stopEditing(target));
        }
      });
  };
};

const createTask = (task, openTaskPage, callee) => {
  if (!task.name || !task.projectId || !task.statusId || !task.typeId) {
    return () => {};
  }

  const URL = `${API_URL}/task`;
  if (task.description instanceof String && task.description.length > 1) {
    task.description = `<p>${task.description.split(/\n/).join('</p><p>')}</p>`;
  }

  return dispatch => {
    dispatch(startLoading());
    dispatch(createTaskRequestStart());

    axios
      .post(URL, task, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(createTaskRequestError());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(finishLoading());
          dispatch(createTaskRequestSuccess(task.projectId, task.sprintId || BACKLOG_ID, response.data.id, response.data));
          dispatch(getTask(task.parentId));
          dispatch(closeCreateTaskModal());
          dispatch(getProjectInfo(task.projectId));
          if (callee) {
            dispatch(getPlanningTasks(callee, { sprintId: task.sprintId || BACKLOG_ID, projectId: task.projectId }));
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

const getProjectHistory = (id, options) => {
  if (!id) {
    return () => {};
  }
  const URL = `${API_URL}/project/${id}/history`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(getProjectHistoryStart());
    axios
      .get(URL, {
        params: {
          ...options
        }
      },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        dispatch(finishLoading());
        if (response && response.status === 200) {
          dispatch(getProjectHistorySuccess(response.data));
        }
      });
  };
};

export const getPortfolios = (name = '') => {

  return dispatch => {
    return axios
    .get(
      `${API_URL}/portfolio`,
      { params: { name } },
      { withCredentials: true }
    )
    .then(response => response.data.data)
    .then(portfolios => ({
      options: portfolios.map((portfolio) => ({
        label: portfolio.name,
        value: portfolio.id
      }))
    }));
  };
};

export { getProjectInfo, getProjectUsers, getProjectSprints, changeProject, createTask, getProjectHistory };
