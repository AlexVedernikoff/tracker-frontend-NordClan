import axios from 'axios';
import * as ProjectActions from '../constants/Project';
import { showNotification } from './Notifications';
import { startLoading, finishLoading } from './Loading';

const gettingProjectInfoStart = () => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_START
});

const gettingProjectInfoSuccess = project => ({
  type: ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS,
  project: project
});

const startProjectChange = () => ({
  type: ProjectActions.PROJECT_CHANGE_START
});

const projectChangeSuccess = response => ({
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

const GetProjectInfo = id => {
  const URL = `/api/project/${id}`;

  return dispatch => {
    dispatch(gettingProjectInfoStart());
    dispatch(startLoading());
    axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(gettingProjectInfoSuccess(response.data));
          dispatch(finishLoading());
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
    dispatch(startProjectChange());
    dispatch(startLoading());

    axios
      .put(URL, ChangedProperties, {
        withCredentials: true
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(projectChangeSuccess(response.data));
          dispatch(finishLoading());
          dispatch(StopEditing(target));
        }
      });
  };
};



export { GetProjectInfo, ChangeProject };
