import * as PlanningTaskActions from '../constants/PlanningTasks';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startTasksReceive = side => ({
  type:
    side === 'left'
      ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_START
      : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_START
});

const tasksReceived = (side, tasks) => ({
  type:
    side === 'left'
      ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_SUCCESS
      : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const getPlanningTasks = (side, options) => {
  const URL = `${API_URL}/task`;
  return dispatch => {
    dispatch(startTasksReceive(side));
    dispatch(startLoading());
    axios
      .get(
        URL,
        {
          params: {
            name: '',
            pageSize: 25,
            currentPage: 1,
            ...options,
            fields: 'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId'
          }
        },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else {
          dispatch(tasksReceived(side, response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default getPlanningTasks;
