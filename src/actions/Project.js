import * as ProjectActions from '../constants/Project';
import axios from 'axios';
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

const StartGettingProjectSprints = () => ({
  type: ProjectActions.PROJECT_SPRINTS_RECEIVE_START
});

const GettingProjectSprintsSuccess = sprints => ({
  type: ProjectActions.PROJECT_SPRINTS_RECEIVE_SUCCESS,
  sprints: sprints
});

export const StartEditing = target => ({
  type: ProjectActions.EDIT_START,
  target: target
});

export const StopEditing = target => ({
  type: ProjectActions.EDIT_FINISH,
  target: target
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
        if (response.status === 200) {
          dispatch(GettingProjectInfoSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

const GetProjectSprints = id => {
  const URL = '/api/sprint/';

  return dispatch => {
    dispatch(StartGettingProjectSprints());
    dispatch(StartLoading());
    axios
      .get(
        URL,
      {
        params: {
          projectId: id
        }
      },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(GettingProjectSprintsSuccess(response.data.data));
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
        dispatch(ProjectChangeError());
        dispatch(FinishLoading());
      })
      .then(response => {
        if (!response) {
          return;
        } else if (response.status === 200) {
          dispatch(ProjectChangeSuccess(response.data));
          dispatch(FinishLoading());
          dispatch(StopEditing(target));
        }
      });
  };
};

export { GetProjectInfo, ChangeProject, GetProjectSprints };
