import * as AuthActions from '../constants/Authentication';
import axios from 'axios';
import { history } from '../Router';
import { StartLoading, FinishLoading } from './Loading';

const StartAuthentication = () => ({
  type: AuthActions.AUTHENTICATION_START
});

const AuthenticationError = message => ({
  type: AuthActions.AUTHENTICATION_ERROR,
  errorMessage: message
});

const AuthenticationReceived = user => ({
  type: AuthActions.AUTHENTICATION_RECEIVED,
  data: user
});

const StartLogout = () => ({
  type: AuthActions.LOGOUT_START
});

const LogoutError = message => ({
  type: AuthActions.LOGOUT_ERROR,
  errorMessage: message
});

const LogoutComplete = () => ({
  type: AuthActions.LOGOUT_COMPLETE
});

const StartReceiveUserInfo = () => ({
  type: AuthActions.USER_INFO_RECEIVE_START
});

const ReceiveUserInfoError = message => ({
  type: AuthActions.USER_INFO_RECEIVE_ERROR,
  errorMessage: message
});

const UserInfoReceived = user => ({
  type: AuthActions.USER_INFO_RECEIVE_SUCCESS,
  user: user
});

export const doAuthentication = ({ username, password }) => {
  const URL = '/api/auth/login';

  return dispatch => {
    dispatch(StartAuthentication());
    axios
      .post(
        URL,
        { login: username, password: password },
        { withCredentials: true }
      )
      .catch(error => dispatch(AuthenticationError(error.message)))
      .then(response => {
        if (response.status === 200) {
          dispatch(AuthenticationReceived(response.data.user));
          history.push('/projects');
        }
      });
  };
};

export const doLogout = () => {
  const URL = '/api/auth/logout';

  return dispatch => {
    window.localStorage.removeItem('simTrackAuthToken');
    dispatch(StartLogout());
    axios
      .delete(URL, { withCredentials: true })
      .catch(error => dispatch(AuthenticationError(error)))
      .then(response => {
        if (response.status === 200) {
          dispatch(LogoutComplete());
          history.push('/login');
        }
      });
  };
};

export const getInfoAboutMe = () => {
  const URL = '/api/user/me';

  return dispatch => {
    dispatch(StartReceiveUserInfo());
    dispatch(StartLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(ReceiveUserInfoError(error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response.status === 200) {
          dispatch(UserInfoReceived(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};
