import * as AuthActions from '../constants/Authentication';
import axios from 'axios';
import { history } from '../Router';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startAuthentication = () => ({
  type: AuthActions.AUTHENTICATION_START
});

const authenticationError = message => ({
  type: AuthActions.AUTHENTICATION_ERROR,
  errorMessage: message
});

const authenticationReceived = user => ({
  type: AuthActions.AUTHENTICATION_RECEIVED,
  data: user
});

const startLogout = () => ({
  type: AuthActions.LOGOUT_START
});

const logoutComplete = () => ({
  type: AuthActions.LOGOUT_COMPLETE
});

const startReceiveUserInfo = () => ({
  type: AuthActions.USER_INFO_RECEIVE_START
});

const UserInfoReceived = user => ({
  type: AuthActions.USER_INFO_RECEIVE_SUCCESS,
  user: user
});

export const doAuthentication = ({ username, password }) => {
  const URL = '/api/auth/login';

  return dispatch => {
    dispatch(startAuthentication());
    axios
      .post(
        URL,
        { login: username, password: password },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(authenticationError(error.message));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(authenticationReceived(response.data.user));
          history.push('/projects');
        }
      });
  };
};

export const doLogout = () => {
  const URL = '/api/auth/logout';

  return dispatch => {
    dispatch(startLogout());
    axios
      .delete(URL, { withCredentials: true })
      .catch(error => dispatch(authenticationError(error)))
      .then(response => {
        if (response && response.status === 200) {
          dispatch(logoutComplete());
          history.push('/login');
        }
      });
  };
};

export const getInfoAboutMe = () => {
  const URL = '/api/user/me';

  return dispatch => {
    dispatch(startReceiveUserInfo());
    dispatch(startLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(UserInfoReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};
