import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';

function startProjectsReceive() {
  return {
    type: ProjectActions.PROJECTS_RECEIVE_START
  };
}

function ProjectsReceiveError(message) {
  return {
    type: ProjectActions.PROJECTS_RECEIVE_ERROR,
    errorMessage: message
  };
}

function ProjectsReceived(projects) {
  return {
    type: ProjectActions.PROJECTS_RECEIVE_SUCCESS,
    data: projects
  };
}

export function getProjects(pageSize = 25, currentPage = 1, tags = '') {
  const URL = `/api/project`;

  return dispatch => {
    dispatch(startProjectsReceive());
    axios
      .get(
        URL,
        {
          params: {
            pageSize: pageSize,
            currentPage: currentPage,
            tags: tags
          }
        },
        { withCredentials: true }
      )
      .catch(error => dispatch(ProjectsReceiveError(error.message)))
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {;
          dispatch(ProjectsReceived(response.data));
        }
      });
  };
}
