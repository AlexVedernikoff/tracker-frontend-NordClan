import * as PlanningTaskActions from '../constants/PlanningTasks';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { StartLoading, FinishLoading } from './Loading';

const StartTasksReceive = (side) => ({
  type: side === 'left' ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_START : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_START
});

const TasksReceiveError = (side, message) => ({
  type: side === 'left' ? PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_ERROR : PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_ERROR,
  errorMessage: message
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
    dispatch(StartLoading());
    axios
      .get(URL, {
        params: {
          name: '',
          pageSize: 25,
          currentPage: 1,
          tags: '',
          ...options,
          fields: 'FactExecutionTime,PlannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId'
        }
      },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(TasksReceiveError(side, error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else {
          dispatch(TasksReceived(side, response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export default GetPlanningTasks;
