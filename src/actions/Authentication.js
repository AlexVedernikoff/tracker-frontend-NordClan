import * as AuthActions from '../constants/Authentication';
import axios from 'axios';
import { history } from '../Router';

const startAuthentication = () => ({
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

const startLogout = () => ({
  type: AuthActions.LOGOUT_START
});

const LogoutError = message => ({
  type: AuthActions.LOGOUT_ERROR,
  errorMessage: message
});

const LogoutComplete = () => ({
  type: AuthActions.LOGOUT_COMPLETE
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
      .catch(error => dispatch(AuthenticationError(error.message)))
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          window.localStorage.setItem('simTrackAuthToken', response.data.token);
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
    dispatch(startLogout());
    axios
      .delete(URL, { withCredentials: true })
      .catch(error => dispatch(AuthenticationError(error)))
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(LogoutComplete());
          history.push('/login');
        }
      });
  };
};
