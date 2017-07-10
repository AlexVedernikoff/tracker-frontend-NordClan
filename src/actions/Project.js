import axios from 'axios';
import * as ProjectActions from '../constants/Project';
import { ShowNotification } from './Notifications';
import { StartLoading, FinishLoading } from './Loading';

const GettingProjectInfoStart = () => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_START
});

const GettingProjectInfoSuccess = project => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS,
  project: project
});

const StartProjectChange = () => ({
  type: ProjectActions.PROJECT_CHANGE_START
});

const ProjectChangeSuccess = response => ({
  type: ProjectActions.PROJECT_CHANGE_SUCCESS,
  changedFields: response
});

export const StartEditing = target => ({
  type: ProjectActions.EDIT_START,
  target: target
});

export const StopEditing = target => ({
  type: ProjectActions.EDIT_FINISH,
  target: target
});

export const requestProjectCreate = () => ({
  type: ProjectActions.PROJECT_CREATE_START
});

export const projectCreateSuccess = project => ({
  type: ProjectActions.PROJECT_CHANGE_SUCCESS,
  createdProject: project
});

const GetProjectInfo = id => {
  const URL = `/api/project/${id}`;

  return dispatch => {
    dispatch(GettingProjectInfoStart());
    dispatch(StartLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(GettingProjectInfoSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

const ChangeProject = (ChangedProperties, target) => {
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
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
        dispatch(FinishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(ProjectChangeSuccess(response.data));
          dispatch(FinishLoading());
          dispatch(StopEditing(target));
        }
      });
  };
};

const CreateProject = project => {
  if (!project.name) {
    return;
  }

  const URL = '/api/project';

  return dispatch => {
    dispatch(StartLoading());

    axios.post(URL, project, {
      withCredentials: true
    });
    .catch(error => {
      dispatch(ShowNotification({ message: error.message, type: 'error' }));
    })
    .then(response => {
      if (response && response.status === 200) {
        dispatch(FinishLoading());
        dispatch(projectCreateSuccess(response.data));
      }
    })
  };
};

export { GetProjectInfo, ChangeProject, CreateProject };
