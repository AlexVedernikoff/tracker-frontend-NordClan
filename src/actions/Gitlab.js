import axios from 'axios';
import { API_URL } from '../constants/Settings';
import * as GitlabActions from '../constants/Gitlab';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { langSelector } from '../selectors/Localize';

import localize from './Gitlab.i18n.json';

const addingGitlabProjectStart = () => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_START
});

const addingGitlabProjectFail = () => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_FAIL
});

const addingGitlabProjectSuccess = project => ({
  type: GitlabActions.ADDING_GITLAB_PROJECT_SUCCESS,
  project
});

const getNamespacesSuccess = namespaces => ({
  type: GitlabActions.GET_GITLAB_NAMESPACES_SUCCESS,
  namespaces
});

const getNamespacesFail = () => ({
  type: GitlabActions.GET_GITLAB_NAMESPACES_FAIL
});

const createGitlabProjectFail = () => ({
  type: GitlabActions.CREATE_GITLAB_PROJECT_FAIL
});

const createGitlabProjectSuccess = project => ({
  type: GitlabActions.CREATE_GITLAB_PROJECT_SUCCESS,
  project
});

const addGitlabProjectByName = (projectId, path) => {
  if (!projectId || !path) {
    return () => {};
  }
  const URL = `${API_URL}/project/addGitlabProject`;
  return (dispatch, getState) => {
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
      .then(response => {
        if (response && response.status === 200) {
          dispatch(addingGitlabProjectSuccess(response.data));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        const errorCode = error.response.data.message;
        const message = localize[langSelector(getState())][errorCode] || errorCode || error.message;
        dispatch(showNotification({ message, type: 'error' }));
        dispatch(addingGitlabProjectFail(error.response.data));
        dispatch(finishLoading());
      });
  };
};

const getNamespaces = search => {
  const URL = `${API_URL}/project/gitLab/getGitlabNamespaces`;
  return dispatch => {
    dispatch(startLoading());
    axios
      .get(URL, {
        params: {
          search
        }
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getNamespacesSuccess(response.data));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(getNamespacesFail());
        dispatch(finishLoading());
      });
  };
};

const createGitlabProject = (projectId, name, namespace_id) => {
  const URL = `${API_URL}/project/${projectId}/createGitlabProject`;
  return (dispatch, getState) => {
    dispatch(startLoading());
    axios
      .post(
        URL,
        {
          name,
          namespace_id
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response && response.status === 200) {
          dispatch(createGitlabProjectSuccess(response.data));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        const errorCode = error.response && error.response.data.message;
        const message = localize[langSelector(getState())][errorCode] || errorCode || error.message;
        // const message = error.response ? error.response.data.status + ' ' + error.response.data.message : error.message;
        dispatch(showNotification({ message, type: 'error' }));
        dispatch(createGitlabProjectFail());
        dispatch(finishLoading());
      });
  };
};

export { addGitlabProjectByName, getNamespaces, createGitlabProject };
