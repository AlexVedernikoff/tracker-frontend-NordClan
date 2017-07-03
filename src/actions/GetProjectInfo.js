import * as ProjectInfoActions from '../constants/GetProjectInfo';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

const GettingProjectInfoStart = () => {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_START
  };
};

const GettingProjectInfoError = message => {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_ERROR,
    message: message
  };
};

const GettingProjectInfoSuccess = project => {
  return {
    type: ProjectInfoActions.PROJECT_INFO_RECEIVE_SUCCESS,
    project: project
  };
};

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

export default GetProjectInfo;
