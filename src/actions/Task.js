import * as TaskActions from '../constants/Task';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';
import { ShowNotification } from './Notifications';

const GetTaskStart = () => ({
  type: TaskActions.GET_TASK_REQUEST_SENT
});

const GetTaskSuccess = task => ({
  type: TaskActions.GET_TASK_REQUEST_SUCCESS,
  data: task
});

const RequestTaskChange = () => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SENT
});

const SuccessTaskChange = changedFields => ({
  type: TaskActions.TASK_CHANGE_REQUEST_SUCCESS,
  changedFields
});

const StartTaskEditing = target => ({
  type: TaskActions.TASK_EDIT_START,
  target
});

const FinishTaskEditing = () => ({
  type: TaskActions.TASK_EDIT_FINISH,
  target
});

const GetTask = id => {
  const URL = `/api/task/${id}`;

  return dispatch => {
    dispatch(GetTaskStart());
    dispatch(StartLoading());

    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(GetTaskSuccess(response.data.data));
          dispatch(FinishLoading());
        }
      });
  };
};

const ChangeTask = (ChangedProperties, target) => {
  if (!ChangedProperties.id) {
    return;
  }

  const URL = `/api/task/${ChangedProperties.id}`;

  return dispatch => {
    dispatch(RequestTaskChange());
    dispatch(StartLoading());

    axios
      .put(URL, ChangedProperties, {
        withCredentials: true
      })
      .catch(err => {
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(SuccessTaskChange(response.data));
          dispatcH(FinishLoading());
          dispatch(StopEditing(target));
        }
      });
  };
};

export { GetTask };
