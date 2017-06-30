import * as ProjectInfoActions from '../constants/GetProjectInfo';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

function GettingProjectInfoStart () {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_START
  };
}

function GettingProjectInfoError (message) {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_ERROR,
    message: message
  };
}

function GettingProjectInfoSuccess (project) {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_SUCCESS,
    project: project
  };
}

export default function GetProjectInfo (id) {
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
}
