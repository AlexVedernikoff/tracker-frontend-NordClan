import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { StartLoading, FinishLoading } from './Loading';
import { ShowNotification } from './Notifications';

const StartProjectsReceive = () => ({
  type: ProjectActions.PROJECTS_RECEIVE_START
});

const ProjectsReceived = projects => ({
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

const GetProjects = (
  pageSize = 25,
  currentPage = 1,
  tags = '',
  name = '',
  dateSprintBegin = '',
  dateSprintEnd = ''
) => {
  const URL = '/api/project';
  return dispatch => {
    dispatch(StartProjectsReceive());
    dispatch(StartLoading());
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
        dispatch(FinishLoading());
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(ProjectsReceived(response.data.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export const requestProjectCreate = project => {
  if (!project.name) {
    return;
  }

  const URL = '/api/project';

  return dispatch => {
    dispatch(StartLoading());
    dispatch(startProjectCreate());

    axios
      .post(URL, project, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(FinishLoading());
          dispatch(projectCreateSuccess(response.data));
        }
      });
  };
};

export default GetProjects;
