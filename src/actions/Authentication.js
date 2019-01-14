import * as AuthActions from '../constants/Authentication';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { getTimesheetsPlayerData } from './TimesheetPlayer';
import { EXTERNAL_USER } from '../constants/Roles';
import { startOfCurrentWeek, endOfCurrentWeek } from '../utils/date';
import { history } from '../History';
import { getErrorMessageByType } from '../utils/ErrorMessages';
import { initSSO } from '../utils/Keycloak';

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

export const userInfoReceiveFailed = () => ({
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
      .post(URL, { login: username, password: password }, { withCredentials: true })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(authenticationReceived(response.data.user));
          if (response.data.user.globalRole !== EXTERNAL_USER) {
            dispatch(getTimesheetsPlayerData(startOfCurrentWeek, endOfCurrentWeek));
          }
        }
      })
      .catch(error => {
        if (error.response.data.status === 404) {
          dispatch(authenticationError(getErrorMessageByType(error.response.data.name)));
        } else {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
        dispatch(userInfoReceiveFailed());
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

  return async dispatch => {
    dispatch(startReceiveUserInfo());
    dispatch(startLoading());
    await initSSO();
    try {
      const response = await axios.get(URL, {}, { withCredentials: true });
      if (response && response.status === 200) {
        if (response.data.globalRole !== EXTERNAL_USER) {
          dispatch(getTimesheetsPlayerData(startOfCurrentWeek, endOfCurrentWeek));
        }
        dispatch(userInfoReceived(response.data));
        dispatch(finishLoading());
      }
    } catch (error) {
      dispatch(finishLoading());
      const pathname = history.getCurrentLocation().pathname;
      if (
        error.response.data.name !== 'UnauthorizedError' ||
        !(pathname === '/login' || /\/externalUserActivate\//i.test(pathname))
      ) {
        dispatch(showNotification({ message: error.message, type: 'error' }));
      }
      dispatch(userInfoReceiveFailed());
    }
  };
};

export const clearRedirect = () => setRedirectPath(null);
