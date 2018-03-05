import * as TaskActions from '../constants/Task';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import {DELETE, GET, POST, PUT, REST_API} from '../constants/RestApi';
import {SOCKET_IO} from '../constants/SocketIO';
import {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  defaultBody as body,
  defaultExtra as extra,
  withdefaultExtra
} from './Common';

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

const getTaskSpentStart = () => ({
  type: TaskActions.GET_TASK_SPENT_REQUEST_SENT
});

const getTaskSpentSuccess = spent => ({
  type: TaskActions.GET_TASK_SPENT_REQUEST_SUCCESS,
  data: spent
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

const stopTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_FINISH,
  target
});

const clearCurrentTask = target => ({
  type: TaskActions.CLEAR_CURRENT_TASK
});

const getTask = id => {
  if (!id) {
    return () => {};
  }
  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${id}`,
    method: GET,
    body,
    extra,
    start: withStartLoading(getTaskStart, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(getTaskSuccess(response.data));
    })(dispatch),
    error: withFinishLoading(error => getTaskFail(error.response.data), true)(dispatch),
  });
};

const getTaskHistory = id => {
  if (!id) {
    return () => {};
  }
  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${id}/history`,
    method: GET,
    body,
    extra,
    start: withStartLoading(getTaskHistoryStart, true)(dispatch),
    response: withFinishLoading(response => getTaskHistorySuccess(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

const getTaskSpent = id => {
  if (!id) {
    return () => {};
  }
  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${id}/spent`,
    method: GET,
    body,
    extra,
    start: withStartLoading(getTaskSpentStart, true)(dispatch),
    response: withFinishLoading(response => getTaskSpentSuccess(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

const changeTask = (ChangedProperties, target, callback) => {
  if (!ChangedProperties.id) {
    return;
  }
  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${ChangedProperties.id}`,
    method: PUT,
    body: ChangedProperties,
    extra,
    start: withStartLoading(requestTaskChange, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(successTaskChange(response.data));
      dispatch(stopTaskEditing(target));
      if (callback) {
        callback();
      }
    })(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

const linkTask = (taskId, linkedTaskId) => {
  if (!taskId) {
    return () => {};
  }

  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${taskId}/links`,
    method: POST,
    body: {
      linkedTaskId
    },
    extra,
    start: withStartLoading(requestTaskLink, true)(dispatch),
    response: withFinishLoading(response => successTaskLink(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

const unlinkTask = (taskId, linkedTaskId) => {
  if (!taskId) {
    return () => {};
  }

  return dispatch => dispatch({
    type: REST_API,
    url: `/task/${taskId}/links/${linkedTaskId}`,
    method: DELETE,
    body,
    extra,
    start: withStartLoading(requestTaskLink, true)(dispatch),
    response: withFinishLoading(response => successTaskLink(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
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

  return dispatch => {
    attachments.map((file) => {
      const data = new FormData();
      data.append('file', file);

      const attachment = {
        id: `${ Date.now() }${ Math.random() }`,
        fileName: file.name
      };

      return dispatch({
        type: REST_API,
        url: `/task/${taskId}/attachment`,
        method: POST,
        body: data,
        extra: withdefaultExtra({
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            dispatch(attachmentUploadProgress(taskId, attachment, progress));
          }
        }),
        start: () => withStartLoading(attachmentUploadStarted, true)(dispatch)(taskId, attachment),
        response: result => withFinishLoading(attachmentUploadSuccess, true)(dispatch)(taskId, attachment, result),
        error: error => withFinishLoading(attachmentUploadFail, true)(dispatch)(taskId, attachment, error)
      });
    });
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
  getTaskSpent,
  startTaskEditing,
  stopTaskEditing,
  changeTask,
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
  setHighLighted,
  clearCurrentTask
};
