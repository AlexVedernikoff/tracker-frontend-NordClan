import * as ProjectActions from '../constants/Project';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

const GettingProjectInfoStart = () => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_START
});

const GettingProjectInfoError = message => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_ERROR,
  message: message
});

const GettingProjectInfoSuccess = project => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS,
  project: project
});

const StartProjectChange = () => ({
  type: ProjectActions.PROJECT_CHANGE_START
});

const ProjectChangeError = message => ({
  type: ProjectActions.PROJECT_CHANGE_ERROR
});

const ProjectChangeSuccess = response => ({
  type: ProjectActions.PROJECT_CHANGE_SUCCESS,
  changedFields: response
});

const GetProjectInfo = id => {
  const URL = `/api/project/${id}`;

  return dispatch => {
    dispatch(GettingProjectInfoStart());
    dispatch(StartLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(GettingProjectInfoError(error.message));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(GettingProjectInfoSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

const ChangeProject = ChangedProperties => {
  if (!ChangedProperties.id) {
    return;
  }

  const URL = `/api/project/${ChangedProperties.id}`;

  return dispatch => {
    dispatch(StartProjectChange());
    dispatch(StartLoading());

    axios
      .put(URL, ChangedProperties, {
        withCredentials: true
      })
      .catch(err => {
        dispatch(ProjectChangeError);
        dispatch(StartLoading);
      })
      .then(response => {
        if (!response) {
          return;
        } else if ((response.status = 200)) {
          dispatch(ProjectChangeSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export { GetProjectInfo, ChangeProject };
