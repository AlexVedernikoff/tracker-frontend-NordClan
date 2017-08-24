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

const requestCommentsByTaskId = (taskId) => ({
  type: TaskActions.GET_COMMENTS_BY_TASK_REQUEST,
  taskId
});

const requestCommentsByTaskIdSuccess = (taskId, result) => ({
  type: TaskActions.GET_COMMENTS_BY_TASK_SUCCESS,
  taskId,
  result
});

const requestCommentsByTaskIdFail = (taskId, error) => ({
  type: TaskActions.GET_COMMENTS_BY_TASK_FAIL,
  taskId,
  error
});

const getCommentsByTask = (taskId) => {
  if (!taskId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/comment`;
  return (dispatch) => {
    dispatch(requestCommentsByTaskId(taskId));
    axios.get(URL)
    .then(
      result => {
        return dispatch(requestCommentsByTaskIdSuccess(taskId, result.data));
      },
      error => dispatch(requestCommentsByTaskIdFail(taskId, error))
    );
  };
};

const commentPublishStart = (taskId, comment) => ({
  type: TaskActions.PUBLISH_COMMENT_REQUEST,
  taskId,
  comment
});

const commentPublishSuccess = (taskId, comment, result) => ({
  type: TaskActions.PUBLISH_COMMENT_SUCCESS,
  taskId,
  comment,
  result
});

const commentPublishFail = (taskId, comment, error) => ({
  type: TaskActions.PUBLISH_COMMENT_FAIL,
  taskId,
  comment,
  error
});

const publishComment = (taskId, comment) => {
  if (!taskId || !comment) {
    return () => {};
  }
  const { text, parentId } = comment;
  const URL = `${API_URL}/task/${taskId}/comment`;
  return (dispatch) => {
    dispatch(commentPublishStart(taskId, comment));
    return axios.post(URL, { text, parentId })
      .then(
        result => dispatch(commentPublishSuccess(taskId, comment, result.data)),
        error => dispatch(commentPublishFail(taskId, comment, error))
      )
      .then(() => dispatch(getCommentsByTask(taskId)));
  };
};

const commentUpdateStart = (taskId, commentId, comment) => ({
  type: TaskActions.UPDATE_COMMENT_REQUEST,
  taskId,
  commentId,
  comment
});

const commentUpdateSuccess = (taskId, commentId, comment, result) => ({
  type: TaskActions.UPDATE_COMMENT_SUCCESS,
  taskId,
  commentId,
  comment,
  result
});

const commentUpdateFail = (taskId, commentId, comment, error) => ({
  type: TaskActions.UPDATE_COMMENT_FAIL,
  taskId,
  commentId,
  comment,
  error
});

const editComment = (taskId, commentId, text) => {
  if (!taskId || !commentId) {
    return () => {};
  }
  const comment = { text };
  const URL = `${API_URL}/task/${taskId}/comment/${commentId}`;
  return (dispatch) => {
    dispatch(commentUpdateStart(taskId, commentId, comment));
    axios.put(URL, comment)
      .then(
        result => {
          dispatch(getCommentsByTask(taskId));
          return dispatch(commentUpdateSuccess(taskId, commentId, comment, result));
        },
        error => dispatch(commentUpdateFail(taskId, commentId, comment, error))
      );
  };
};

const commentRemoveStart = (taskId, commentId) => ({
  type: TaskActions.REMOVE_COMMENT_REQUEST,
  taskId,
  commentId
});

const commentRemoveSuccess = (taskId, commentId, result) => ({
  type: TaskActions.REMOVE_COMMENT_SUCCESS,
  taskId,
  commentId,
  result
});

const commentRemoveFail = (taskId, commentId, error) => ({
  type: TaskActions.REMOVE_COMMENT_FAIL,
  taskId,
  commentId,
  error
});

const removeComment = (taskId, commentId) => {
  if (!taskId || !commentId) {
    return () => {};
  }

  const URL = `${API_URL}/task/${taskId}/comment/${commentId}`;
  return (dispatch) => {
    dispatch(commentRemoveStart(taskId, commentId));
    axios.delete(URL)
    .then(
      result => {
        dispatch(getCommentsByTask(taskId));
        return dispatch(commentRemoveSuccess(taskId, commentId, result));
      },
      error => dispatch(commentRemoveFail(taskId, commentId, error))
    );
  };
};

const updateCurrentCommentText = (text) => ({
  type: TaskActions.SET_CURRENT_COMMENT_TEXT,
  text
});

const selectParentCommentForReply = (parentId) => ({
  type: TaskActions.SELECT_COMMENT_FOR_REPLY,
  parentId
});

const setCommentForEdit = (comment) => ({
  type: TaskActions.SET_COMMENT_FOR_EDIT,
  comment
});

const resetCurrentEditingComment = () => ({
  type: TaskActions.RESET_CURRENT_EDITING_COMMENT
});

const setCurrentCommentExpired = () => ({
  type: TaskActions.SET_CURRENT_COMMENT_EXPIRED
});

const setHighLighted = (comment) => ({
  type: TaskActions.SET_HIGHLIGHTED_COMMENT,
  comment
});

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
  removeAttachment,
  getCommentsByTask,
  publishComment,
  editComment,
  removeComment,
  updateCurrentCommentText,
  selectParentCommentForReply,
  setCommentForEdit,
  resetCurrentEditingComment,
  setCurrentCommentExpired,
  setHighLighted
};
