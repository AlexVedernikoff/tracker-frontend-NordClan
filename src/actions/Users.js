import { GET_DEV_OPS_USERS_START, GET_DEV_OPS_USERS_SUCCESS } from '../constants/UsersAction';
import axios from 'axios';
import { API_URL } from '../constants/Settings';
import { finishLoading, startLoading } from './Loading';

const getDevOpsUsersStart = () => ({
  type: GET_DEV_OPS_USERS_START
});

const getDevOpsUsersSuccess = data => ({
  type: GET_DEV_OPS_USERS_SUCCESS,
  data: data
});

export const getDevOpsUsers = () => {
  const URL = `${API_URL}/users/devops`;

  return dispatch => {
    dispatch(getDevOpsUsersStart());
    dispatch(startLoading());
    axios
      .get(URL)
      .then(response => {
        if (response) {
          dispatch(getDevOpsUsersSuccess(response.data));
          dispatch(finishLoading());
        }
      })
      .catch(err => {
        dispatch(finishLoading());
      });
  };
};
