import * as AuthActions from '../constants/Authentication';
import axios from 'axios';
function startAuthentication() {
  return {
    type: AuthActions.AUTHENTICATION_START
  };
}

function AuthenticationError(message) {
  return {
    type: AuthActions.AUTHENTICATION_ERROR,
    errorMessage: message
  };
}

function AuthenticationReceived(user) {
  return {
    type: AuthActions.AUTHENTICATION_RECEIVED,
    data: user
  };
}

export function doAuthentication({ username, password }) {
  const URL = `http://sim-track.simbirsoft/api/auth/login`;

  return dispatch => {
    dispatch(startAuthentication());
    axios
      .post(URL, { login: username, password })
      .catch(error => dispatch(AuthenticationError(error.message)))
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          window.localStorage.setItem('simTrackAuthToken', response.data.token);
          dispatch(AuthenticationReceived(response.data.user));
        }
      });
  };
}

export function doLogout() {
  const URL = `http://sim-track.simbirsoft/api/auth/logout`;

  return dispatch => {
    dispatch(startLogout());
    axios
      .delete(URL, {
        params: { token: window.localStorage.getItem('simTrackAuthToken') }
      })
      .catch(error => dispatch(AuthenticationError(error)))
      .then(response => {
        if (!response) {
          return;
        } else {
          window.localStorage.removeItem('simTrackAuthToken');
          dispatch(LogoutComplete());
        }
      });
  };
}
