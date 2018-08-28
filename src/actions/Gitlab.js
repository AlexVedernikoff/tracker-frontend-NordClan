import axios from 'axios';
import { API_URL } from '../constants/Settings';
import * as GitlabActions from '../constants/Gitlab';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const addingGitlabProjectStart = () => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_START
});

const addingGitlabProjectFail = () => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_FAIL
});

const addingGitlabProjectSuccess = data => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_SUCCESS,
  payload: data
});

const addGitlabProjectByName = (projectId, path) => {
  if (!projectId || !path) {
    return () => {};
  }
  const URL = `${API_URL}/project/addGitlabProject`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(addingGitlabProjectStart());
    axios
      .post(
        URL,
        {
          projectId,
          path
        },
        { withCredentials: true }
      )
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(addingGitlabProjectFail(error.response.data));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(addingGitlabProjectSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export { addGitlabProjectByName };
