import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';

function startProjectsReceive() {
  return {
    type: AuthActions.PROJECTS_RECEIVE_START
  };
}

function ProjectsReceiveError(message) {
  return {
    type: AuthActions.PROJECTS_RECEIVE_ERROR,
    errorMessage: message
  };
}

function ProjectsReceived(projects) {
  return {
    type: AuthActions.PROJECTS_RECEIVE_SUCCESS,
    data: projects
  };
}

export function getProjects(pageSize, currentPage, tags) {
  const URL = `/project`;

  return dispatch => {
    dispatch(startProjectsReceive());
    axios
      .get(
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
}
