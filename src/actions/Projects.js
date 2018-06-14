import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { history } from '../History';
import { API_URL } from '../constants/Settings';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { getInfoAboutMe } from './Authentication';

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

const projectCreateFail = error => ({
  type: ProjectActions.PROJECT_CREATE_FAIL,
  error: error
});

export const openCreateProjectModal = () => ({
  type: ProjectActions.OPEN_CREATE_PROJECT_MODAL
});

export const closeCreateProjectModal = () => ({
  type: ProjectActions.CLOSE_CREATE_PROJECT_MODAL
});

const getProjects = ({
  pageSize = 20,
  currentPage = 1,
  tags = '',
  name = '',
  dateSprintBegin = '',
  dateSprintEnd = '',
  statusId = '',
  typeId = ''
}) => {
  const URL = `${API_URL}/project`;
  return dispatch => {
    dispatch(startProjectsReceive());
    dispatch(startLoading());
    axios
      .get(
        URL,
        {
          params: {
            pageSize,
            currentPage,
            tags,
            name,
            fields: 'name, statusId, createdAt',
            dateSprintBegin,
            dateSprintEnd,
            statusId,
            typeId
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

  const URL = `${API_URL}/project`;

  return dispatch => {
    dispatch(startLoading());
    dispatch(startProjectCreate());

    axios
      .post(URL, project, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(finishLoading());
        if (error.response.status === 400) {
          dispatch(projectCreateFail(error.response.data));
        } else {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(finishLoading());
          dispatch(projectCreateSuccess(response.data));
          dispatch(closeCreateProjectModal());
          dispatch(getInfoAboutMe());
          dispatch(getProjects());

          if (openProjectPage) {
            history.push(`projects/${response.data.id}`);
          }
        }
      });
  };
};

export default getProjects;
