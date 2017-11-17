import * as TaskActions from '../constants/Tasks';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { CLEAR_CURRENT_TASKS } from '../constants/Tasks';

const startTasksReceive = () => ({
  type: TaskActions.TASKS_RECEIVE_START
});

const tasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const getTasks = (options) => {
  const URL = `${API_URL}/task`;
  return dispatch => {
    dispatch(startTasksReceive());
    dispatch(startLoading());
    axios
      .get(URL, {
        params: {
          name: '',
          tags: '',
          performerId: '',
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
          return;
        } else {
          dispatch(tasksReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default getTasks;

export const clearStateTasks = () => ({
  type: CLEAR_CURRENT_TASKS
});
