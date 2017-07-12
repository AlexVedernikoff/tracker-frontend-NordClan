import * as TaskActions from '../constants/Tasks';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startTasksReceive = () => ({
  type: TaskActions.TASKS_RECEIVE_START
});

const tasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const getTasks = (options) => {
  const URL = '/api/task';
  return dispatch => {
    dispatch(startTasksReceive());
    dispatch(startLoading());
    axios
      .get(URL, {
        params: {
          name: '',
          pageSize: 25,
          currentPage: 1,
          tags: '',
          ...options,
          fields: 'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId'
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
