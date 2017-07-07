import * as ProjectActions from '../constants/Projects';
import axios from 'axios';
import { store } from '../Router';
import { history } from '../Router';
import { StartLoading, FinishLoading } from './Loading';

const StartProjectsReceive = () => ({
  type: ProjectActions.PROJECTS_RECEIVE_START
});

const ProjectsReceiveError = message => ({
  type: ProjectActions.PROJECTS_RECEIVE_ERROR,
  errorMessage: message
});

const ProjectsReceived = projects => ({
  type: ProjectActions.PROJECTS_RECEIVE_SUCCESS,
  data: projects
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
        dispatch(ProjectsReceiveError(error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(ProjectsReceived(response.data.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export default GetProjects;
