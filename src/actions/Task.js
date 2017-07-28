import * as TaskActions from '../constants/Task';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const getTaskStart = () => ({
  type: TaskActions.GET_TASK_REQUEST_SENT
});

const getTaskSuccess = task => ({
  type: TaskActions.GET_TASK_REQUEST_SUCCESS,
  data: task
});

const requestTaskChange = () => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SENT
});

const successTaskChange = changedFields => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SUCCESS,
  changedFields
});

const requestTaskChangeUser = () => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SENT
});

const successTaskChangeUser = changedFields => ({
  type: TaskActions.TASK_CHANGE_USER_SUCCESS,
  changedFields
});

const startTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_START,
  target
});

const startTaskChangeUser = () => ({
  type: TaskActions.TASK_EDIT_START,
  target: 'User'
});

const stopTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_FINISH,
  target
});

const getTask = id => {
  if (!id) {
    return () => {};
  }

  const URL = `${API_URL}/task/${id}`;

  return dispatch => {
    dispatch(getTaskStart());
    dispatch(startLoading());

    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getTaskSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

const changeTask = (ChangedProperties, target) => {
  if (!ChangedProperties.id) {
    return;
  }

  const URL = `${API_URL}/task/${ChangedProperties.id}`;

  return dispatch => {
    dispatch(requestTaskChange());
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
          dispatch(successTaskChange(response.data));
          dispatch(finishLoading());
          dispatch(stopTaskEditing(target));
        }
      });
  };
};

const changeTaskUser = (taskId, userId, statusId) => {
  if (!taskId) {
    return;
  }

  const URL = `${API_URL}/task/${taskId}/users`;

  return dispatch => {
    dispatch(requestTaskChangeUser());
    dispatch(startLoading());

    axios
      .post(URL, {
        userId,
        statusId
      }, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successTaskChangeUser(response.data));
          dispatch(finishLoading());
          dispatch(stopTaskEditing('User'));
        }
      });
  };
};

export { getTask, startTaskEditing, stopTaskEditing, changeTask, changeTaskUser, startTaskChangeUser };
