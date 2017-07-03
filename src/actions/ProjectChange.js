import * as ProjectChangeActions from '../constants/ProjectChange';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

const StartProjectChange = () => ({
  type: ProjectChangeActions.PROJECT_CHANGE_START
});

const ProjectChangeError = message => ({
  type: ProjectChangeActions.PROJECT_CHANGE_ERROR
});

const ProjectChangeSuccess = () => ({
  type: ProjectChangeActions.PROJECT_CHANGE_SUCCESS
});

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
          dispatch(ProjectChangeSuccess());
          dispatch(FinishLoading());
        }
      });
  };
};

export default ChangeProject;
