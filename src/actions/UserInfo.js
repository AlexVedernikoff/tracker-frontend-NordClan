import * as UserInfoActions from '../constants/UserInfo';
import axios from 'axios';
import { history } from '../Router';
import { StartLoading, FinishLoading } from "./Loading";

function startReceiveUserInfo () {
  return {
    type: UserInfoActions.USER_INFO_RECEIVE_START
  };
}

function ReceiveUserInfoError (message) {
  return {
    type: UserInfoActions.USER_INFO_RECEIVE_ERROR,
    errorMessage: message
  };
}

function UserInfoReceived (user) {
  return {
    type: UserInfoActions.USER_INFO_RECEIVE_SUCCESS,
    user: user
  };
}

export function getInfoAboutMe () {
  const URL = '/api/user/me';

  return dispatch => {
    dispatch(startReceiveUserInfo());
    dispatch(StartLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(ReceiveUserInfoError(error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(UserInfoReceived(response.data));
          dispatch(FinishLoading());;
        }
      });
  };
}
