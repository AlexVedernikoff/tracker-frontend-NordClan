import * as TaskActions from '../constants/Tasks';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { StartLoading, FinishLoading } from './Loading';

const StartTasksReceive = () => ({
  type: TaskActions.TASKS_RECEIVE_START
});

const TasksReceiveError = message => ({
  type: TaskActions.TASKS_RECEIVE_ERROR,
  errorMessage: message
});

const TasksReceived = tasks => ({
  type: TaskActions.TASKS_RECEIVE_SUCCESS,
  data: tasks
});

const GetTasks = (
  projectId,
  name = '',
  pageSize = 25,
  currentPage = 1,
  tags = ''
) => {
  const URL = '/api/task';
  return dispatch => {
    dispatch(StartTasksReceive());
    dispatch(StartLoading());
    axios
      .get(URL, {
            params: {
              pageSize: pageSize,
              currentPage: currentPage,
              tags: tags,
              name: name,
              projectId: projectId,
              fields: 'FactExecutionTime,PlannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId'
            }
        },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(TasksReceiveError(error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else {
          dispatch(TasksReceived(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export default GetTasks;
