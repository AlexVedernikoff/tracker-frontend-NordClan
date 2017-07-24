import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startProjectsReceive = () => ({
  type: ProjectActions.PROJECTS_RECEIVE_START
});

const projectsReceived = projects => ({
  type: ProjectActions.PROJECTS_RECEIVE_SUCCESS,
  data: projects
});

const startProjectCreate = () => ({
  type: ProjectActions.PROJECT_CREATE_START
});

const projectCreateSuccess = project => ({
  type: ProjectActions.PROJECT_CREATE_SUCCESS,
  createdProject: project
});

export const openCreateProjectModal = () => ({
  type: ProjectActions.OPEN_CREATE_PROJECT_MODAL
});

export const closeCreateProjectModal = () => ({
  type: ProjectActions.CLOSE_CREATE_PROJECT_MODAL
});

const getProjects = (
  pageSize = 20,
  currentPage = 1,
  tags = '',
  name = '',
  dateSprintBegin = '',
  dateSprintEnd = ''
) => {
  const URL = '/api/project';
  return dispatch => {
    dispatch(startProjectsReceive());
    dispatch(startLoading());
    axios
      .get(
        URL,
      {
        params: {
          pageSize: pageSize,
          currentPage: currentPage,
          tags: tags,
          name: name,
          fields: 'name, statusId, createdAt',
          dateSprintBegin: dateSprintBegin,
          dateSprintEnd: dateSprintEnd
        }
      },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(projectsReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export const requestProjectCreate = (project, openProjectPage) => {
  if (!project.name) {
    return;
  }

  const URL = '/api/project';

  return dispatch => {
    dispatch(startLoading());
    dispatch(startProjectCreate());

    axios
      .post(URL, project, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(finishLoading());
          dispatch(projectCreateSuccess(response.data));
          dispatch(closeCreateProjectModal());
          dispatch(getProjects());

          if (openProjectPage) {
            history.push(`projects/${response.data.id}`);
          }

        }
      });
  };
};

export default getProjects;
