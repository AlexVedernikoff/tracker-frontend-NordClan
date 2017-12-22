import * as TaskActions from '../constants/Tasks';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startTasksReceive = () => ({
  type: TaskActions.TASKS_RECEIVE_START
});

const tasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const tasksListReceived = tasks => ({
  type: TaskActions.TASKS_LIST_RECEIVE_SUCCESS,
  data: tasks
});

const getTasks = (options, onlyTaskListUpdate = false) => {
  const URL = `${API_URL}/task`;
  return dispatch => {
    dispatch(startTasksReceive());
    dispatch(startLoading());
    axios
      .get(URL, {
        params: {
          ...options,
          fields: 'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId,prefix'
        }
      },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (!response) {
          dispatch(finishLoading());
          return;
        } else {
          if (onlyTaskListUpdate) {
            dispatch(tasksListReceived(response.data));
          } else {
            dispatch(tasksReceived(response.data));
          }
          dispatch(finishLoading());
        }
      });
  };
};

export default getTasks;

export const clearCurrentProjectAndTasks = () => ({
  type: TaskActions.CLEAR_CURRENT_PROJECT_AND_TASKS
});
