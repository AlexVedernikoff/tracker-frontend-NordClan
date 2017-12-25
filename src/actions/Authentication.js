import * as AuthActions from '../constants/Authentication';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { getTimesheetsPlayerData } from './TimesheetPlayer';
import { startOfCurrentWeek, endOfCurrentWeek } from '../utils/date';

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

const userInfoReceived = user => ({
  type: AuthActions.USER_INFO_RECEIVE_SUCCESS,
  user: user
});

const userInfoReceiveFailed = () => ({
  type: AuthActions.USER_INFO_RECEIVE_ERROR
});

export const setRedirectPath = pathObj => ({
  type: AuthActions.SET_REDIRECT_PATH,
  path: pathObj
});

export const doAuthentication = ({ username, password }) => {
  const URL = `${API_URL}/auth/login`;

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
        dispatch(userInfoReceiveFailed());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(authenticationReceived(response.data.user));
        }
      });
  };
};

export const doLogout = () => {
  const URL = `${API_URL}/auth/logout`;

  return dispatch => {
    dispatch(startLogout());
    axios
      .delete(URL, { withCredentials: true })
      .catch(error => dispatch(authenticationError(error)))
      .then(response => {
        if (response && response.status === 200) {
          dispatch(logoutComplete());
        }
      });
  };
};

export const getInfoAboutMe = () => {
  const URL = `${API_URL}/user/me`;

  return dispatch => {
    dispatch(startReceiveUserInfo());
    dispatch(startLoading());
    return axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(userInfoReceiveFailed());
        dispatch(finishLoading());
        if (error.response.data.name !== 'UnauthorizedError') {
          dispatch(showNotification({message: error.message, type: 'error'}));
        }
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getTimesheetsPlayerData(startOfCurrentWeek, endOfCurrentWeek));
          dispatch(userInfoReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export const clearRedirect = () => (
  setRedirectPath(null)
);
