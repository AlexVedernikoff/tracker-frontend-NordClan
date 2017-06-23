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

function AuthenticationReceived() {
  return {
    type: AuthActions.AUTHENTICATION_RECEIVED
  };
}

export function doAuthentication(username, password) {
  const URL = `http://sim-track.simbirsoft/api/auth/login`;

  return dispatch => dispatch(startAuthentication());
  axios
    .post(url, { login: username, ...password })
    .catch(error => dispatch(AuthenticationError(error)))
    .then(response => {
      if (!response) {
        return;
      } else {
        window.localStorage.setItem('simTrackAuthToken', response.data.token);
        dispatch(dispatch(AuthenticationReceived()));
      }
    });
}
