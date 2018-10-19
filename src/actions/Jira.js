import axios from 'axios';
import { API_URL } from '../constants/Settings';
import * as JiraActions from '../constants/Jira';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const jiraAuthorizeStart = () => ({
  type: JiraActions.JIRA_AUTHORIZE_START
});

const jiraAuthorizeSucess = token => ({
  type: JiraActions.JIRA_AUTHORIZE_SUCCESS,
  token
});

const jiraAuthorizeError = () => ({
  type: JiraActions.JIRA_AUTHORIZE_ERROR
});

const jiraAuthorize = credentials => {
  const { username, password, server, email } = credentials;
  const URL = `${API_URL}/jira/auth`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(jiraAuthorizeStart());
    return axios
      .post(
        URL,
        {
          username,
          password,
          server,
          email
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response && response.status === 200) {
          dispatch(jiraAuthorizeSucess(response.data.token));
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(jiraAuthorizeError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

export { jiraAuthorize };
