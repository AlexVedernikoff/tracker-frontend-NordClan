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

const getTaskHistoryStart = () => ({
  type: TaskActions.GET_TASK_HISTORY_REQUEST_SENT
});

const getTaskHistorySuccess = history => ({
  type: TaskActions.GET_TASK_HISTORY_REQUEST_SUCCESS,
  data: history
});
const getTaskFail = error => ({
  type: TaskActions.GET_TASK_REQUEST_FAIL,
  error: error
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

const requestTaskLink = () => ({
  type: TaskActions.TASK_LINK_SENT
});

const successTaskLink = linkedTasks => ({
  type: TaskActions.TASK_LINK_SUCCESS,
  linkedTasks
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
        dispatch(getTaskFail(error.response.data));
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

const getTaskHistory = id => {
  if (!id) {
    return () => {};
  }

  const URL = `${API_URL}/task/${id}/history`;

  return dispatch => {
    dispatch(getTaskHistoryStart());
    dispatch(startLoading());

    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getTaskHistorySuccess(response.data));
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

const linkTask = (taskId, linkedTaskId) => {
  if (!taskId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/links`;

  return dispatch => {
    dispatch(requestTaskLink());
    dispatch(startLoading());

    axios
    .post(URL,
      {
        linkedTaskId
      }, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successTaskLink(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

const unlinkTask = (taskId, linkedTaskId) => {
  if (!taskId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/links/${linkedTaskId}`;

  return dispatch => {
    dispatch(requestTaskLink());
    dispatch(startLoading());

    axios
    .delete(URL, {}, {
      withCredentials: true
    })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successTaskLink(response.data));
          dispatch(finishLoading());
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

const attachmentUploadStarted = (taskId, attachment) => ({
  type: TaskActions.TASK_ATTACHMENT_UPLOAD_REQUEST,
  taskId,
  attachment
});

const attachmentUploadProgress = (taskId, attachment, progress) => ({
  type: TaskActions.TASK_ATTACHMENT_UPLOAD_PROGRESS,
  taskId,
  attachment,
  progress
});

const attachmentUploadSuccess = (taskId, attachment, result) => ({
  type: TaskActions.TASK_ATTACHMENT_UPLOAD_SUCCESS,
  taskId,
  attachment,
  result
});

const attachmentUploadFail = (taskId, attachment, error) => ({
  type: TaskActions.TASK_ATTACHMENT_UPLOAD_FAIL,
  taskId,
  attachment,
  error
});

const uploadAttachments = (taskId, attachments) => {
  if (!taskId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/attachment`;
  return (dispatch) => {
    axios.all(attachments.map((attachment) => {
      const data = new FormData();
      data.append('file', attachment);
      attachmentUploadStarted(taskId, attachment);
      return axios.post(URL, data, {
        onUploadProgress: (progressEvent) => dispatch(
          attachmentUploadProgress(taskId, attachment, Math.round((progressEvent.loaded * 100) / progressEvent.total))
        )
      })
      .then(
        result => attachmentUploadSuccess(taskId, attachment, result),
        error => attachmentUploadFail(taskId, attachment, error)
      );
    }))
    .then(() => dispatch(getTask(taskId)));
  };
};

const startRemoveAttachment = (taskId, attachmentId) => ({
  type: TaskActions.TASK_ATTACHMENT_REMOVE_REQUEST,
  taskId,
  attachmentId
});

const successRemoveAttachment = (taskId, attachmentId, result) => ({
  type: TaskActions.TASK_ATTACHMENT_REMOVE_SUCCESS,
  taskId,
  attachmentId,
  result
});

const failRemoveAttachment = (taskId, attachmentId, error) => ({
  type: TaskActions.TASK_ATTACHMENT_REMOVE_FAIL,
  taskId,
  attachmentId,
  error
});

const removeAttachment = (taskId, attachmentId) => {
  if (!taskId || !attachmentId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/attachment/${attachmentId}`;
  return (dispatch) => {
    dispatch(startRemoveAttachment(taskId, attachmentId));
    axios.delete(URL)
    .then(
      result => {
        dispatch(getTask(taskId));
        return dispatch(successRemoveAttachment(taskId, attachmentId, result));
      },
          error => dispatch(failRemoveAttachment(taskId, attachmentId, error))
      );
  };
};

export {
  getTask,
  getTaskHistory,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
  changeTaskUser,
  startTaskChangeUser,
  linkTask,
  unlinkTask,
  uploadAttachments,
  removeAttachment
};
