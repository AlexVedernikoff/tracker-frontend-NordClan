import * as PlanningTaskActions from '../constants/PlanningTasks';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const StartTasksReceive = (side) => ({
  type: side === 'left' ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_START : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_START
});

const TasksReceived = (side, tasks) => ({
  type: side === 'left' ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_SUCCESS : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const GetPlanningTasks = (side, options) => {
  console.log(side, options);
  const URL = '/api/task';
  return dispatch => {
    dispatch(StartTasksReceive(side));
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
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else {
          dispatch(TasksReceived(side, response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default GetPlanningTasks;
