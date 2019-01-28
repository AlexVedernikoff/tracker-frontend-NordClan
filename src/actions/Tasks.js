import * as TaskActions from '../constants/Tasks';
import * as TaskAction from '../constants/Task';
import { API_URL } from '../constants/Settings';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
// import { stopTaskEditing } from './Task';
import { PUT, REST_API } from '../constants/RestApi';
import { defaultErrorHandler, defaultExtra as extra, withFinishLoading, withStartLoading } from './Common';
import { createCancelableRequest } from '../utils/cancelableRequest';
import { clearGoals } from './Goals';

const startTasksReceive = id => ({
  type: TaskActions.TASKS_RECEIVE_START,
  data: id
});

const tasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const tasksListReceived = tasks => ({
  type: TaskActions.TASKS_LIST_RECEIVE_SUCCESS,
  data: tasks
});

const requestTasksChange = () => ({
  type: TaskAction.TASK_CHANGE_REQUEST_SENT
});

// const successTaskChange = changedFields => ({
//   type: TaskAction.TASK_CHANGE_REQUEST_SUCCESS,
//   changedFields
// });

// const postChangeFail = error => ({
//   type: TaskActions.TASK_CHANGE_REQUEST_FAIL,
//   closeHasError: false,
//   error: error
// });

const getTasks = (options, onlyTaskListUpdate = false) => {
  const URL = `${API_URL}/task`;
  options.queryId = Date.now().toString();
  const generateConfig = dispatch => ({
    reqConfig: {
      method: 'GET',
      url: URL,
      params: {
        //pageSize: 25,
        currentPage: 0,
        ...options,
        fields: 'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId,prefix'
      },
      withCredentials: true
    },
    onStart: () => {
      dispatch(startTasksReceive(options.queryId));
      dispatch(startLoading());
    },
    onSuccess: response => {
      if (response) {
        if (onlyTaskListUpdate) {
          dispatch(tasksListReceived(response.data));
        } else {
          dispatch(tasksReceived(response.data));
        }
      }
      dispatch(finishLoading());
    },
    onError: error => {
      dispatch(finishLoading());
      dispatch(showNotification({ message: error.message, type: 'error' }));
    },
    onFinishLoading: () => dispatch(finishLoading())
  });

  return dispatch => createCancelableRequest(dispatch, generateConfig);
};

export const changeTasks = (ChangedTasksProperties, callback) => {
  return dispatch => {
    dispatch({
      type: REST_API,
      url: '/tasks',
      method: PUT,
      body: ChangedTasksProperties,
      extra,
      start: withStartLoading(requestTasksChange, true)(dispatch),
      response: withFinishLoading(() => {
        if (callback) {
          callback();
        }
      }, false)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
  };
};

export default getTasks;

export const clearCurrentProjectAndTasks = () => {
  return dispatch => {
    dispatch({
      type: TaskActions.CLEAR_CURRENT_PROJECT_AND_TASKS
    });
    dispatch(clearGoals());
  };
};
