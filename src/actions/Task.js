import * as TaskActions from '../constants/Task';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';
import { ShowNotification } from './Notifications';

const getTaskStart = () => ({
  type: TaskActions.GET_TASK_REQUEST_SENT
});

const getTaskSuccess = task => ({
  type: TaskActions.GET_TASK_REQUEST_SUCCESS,
  data: task
});

const requestTaskChange = () => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SENT
});

const successTaskChange = changedFields => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SUCCESS,
  changedFields
});

const startTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_START,
  target
});

const stopTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_FINISH,
  target
});

const getTask = id => {
  const URL = `/api/task/${id}`;

  return dispatch => {
    dispatch(getTaskStart());
    dispatch(StartLoading());

    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          console.log(response);
          dispatch(getTaskSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

const changeTask = (ChangedProperties, target) => {
  if (!ChangedProperties.id) {
    return;
  }

  const URL = `/api/task/${ChangedProperties.id}`;

  return dispatch => {
    dispatch(requestTaskChange());
    dispatch(StartLoading());

    axios
      .put(URL, ChangedProperties, {
        withCredentials: true
      })
      .catch(err => {
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successTaskChange(response.data));
          dispatch(FinishLoading());
          dispatch(stopTaskEditing(target));
        }
      });
  };
};

export { getTask, startTaskEditing, stopTaskEditing, changeTask };
