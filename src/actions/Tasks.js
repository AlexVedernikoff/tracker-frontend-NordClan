import * as TaskActions from '../constants/Tasks';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const StartTasksReceive = () => ({
  type: TaskActions.TASKS_RECEIVE_START
});

const TasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const GetTasks = (options) => {
  const URL = '/api/task';
  return dispatch => {
    dispatch(StartTasksReceive());
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
          dispatch(TasksReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default GetTasks;
