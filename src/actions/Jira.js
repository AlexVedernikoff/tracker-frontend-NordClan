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

const jiraAssociateProjectStart = () => ({
  type: JiraActions.JIRA_ASSOCIATE_PROJECT_START
});

const jiraAssociateProjectSuccess = project => ({
  type: JiraActions.JIRA_ASSOCIATE_PROJECT_SUCCESS,
  project
});

const jiraAssociateProjectError = () => ({
  type: JiraActions.JIRA_CREATE_PROJECT_ERROR
});

const associateWithJiraProject = (headers, data) => {
  const { jiraProjectId: id, simtrackProjectId, jiraHostName } = data;
  const URL = `${API_URL}/jira/associateProjectWithJira`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(jiraAssociateProjectStart());
    return axios
      .post(
        URL,
        {
          jiraProjectId: id,
          simtrackProjectId,
          jiraHostName
        },
        {
          withCredentials: true,
          headers
        }
      )
      .then(response => {
        if (response && response.status === 200) {
          dispatch(
            jiraAssociateProjectSuccess({
              jiraHostName: data.jiraHostName,
              id: response.data.jiraExternalId,
              jiraProjectName: response.data.jiraProjectName,
              simtrackProjectId
            })
          );
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(jiraAssociateProjectError(error));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const getJiraProjectsStart = () => ({
  type: JiraActions.GET_JIRA_PROJECTS_START
});

const getJiraProjectsSuccess = projects => ({
  type: JiraActions.GET_JIRA_PROJECTS_SUCCESS,
  projects
});

const getJiraProjectsError = () => ({
  type: JiraActions.GET_JIRA_PROJECTS_ERROR
});

const cleanJiraAssociationSuccess = projectId => ({
  type: JiraActions.CLEAN_JIRA_ASSOCIATION_SUCCESS,
  id: projectId
});

const getJiraProjects = headers => {
  const URL = `${API_URL}/jira/projects`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(getJiraProjectsStart());
    axios
      .get(URL, { headers })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getJiraProjectsSuccess(response.data.projects));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(getJiraProjectsError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const getSimtrackUsersByNameStart = () => ({
  type: JiraActions.GET_SIMTRACK_USERS_BY_NAME_START
});

const getSimtrackUsersByNameSuccess = simtrackUsers => ({
  type: JiraActions.GET_SIMTRACK_USERS_BY_NAME_SUCCESS,
  simtrackUsers
});

const getSimtrackUsersByNameError = () => ({
  type: JiraActions.GET_SIMTRACK_USERS_BY_NAME_ERROR
});

const getSimtrackUsersByName = name => {
  const URL = `${API_URL}/user/autocompleter/?userName=${name}`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(getSimtrackUsersByNameStart());
    return axios
      .get(URL)
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getSimtrackUsersByNameSuccess(response.data));
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(getSimtrackUsersByNameError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const setAssociationStart = () => ({
  type: JiraActions.SET_ASSOCIATION_START
});

const setAssociationSuccess = associations => ({
  type: JiraActions.SET_ASSOCIATION_SUCCESS,
  associations
});

const setAssociationError = () => ({
  type: JiraActions.SET_ASSOCIATION_ERROR
});

const setAssociation = (headers, projectId, issueTypesAssociation, statusesAssociation, userEmailAssociation) => {
  const URL = `${API_URL}/jira/setProjectAssociation`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(setAssociationStart());
    return axios
      .post(
        URL,
        {
          projectId,
          issueTypesAssociation,
          statusesAssociation,
          userEmailAssociation
        },
        {
          withCredentials: true,
          headers
        }
      )
      .then(response => {
        if (response && response.status === 200) {
          dispatch(setAssociationSuccess(response.data));
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(setAssociationError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const createBatchStart = () => ({
  type: JiraActions.CREATE_BATCH_START
});

const createBatchSuccess = () => ({
  type: JiraActions.CREATE_BATCH_SUCCESS
});

const createBatchError = () => ({
  type: JiraActions.CREATE_BATCH_ERROR
});

const createBatch = (headers, pid) => {
  const URL = `${API_URL}/jira/batch`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(createBatchStart());
    return axios
      .post(
        URL,
        {
          pid
        },
        {
          withCredentials: true,
          headers
        }
      )
      .then(response => {
        if (response && response.status === 200) {
          dispatch(createBatchSuccess(response.data));
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(createBatchError(error.response));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const getProjectAssociationStart = () => ({
  type: JiraActions.GET_PROJECT_ASSOCIATION_START
});

const getProjectAssociationSuccess = associations => ({
  type: JiraActions.GET_PROJECT_ASSOCIATION_SUCCESS,
  associations
});

const getProjectAssociationError = () => ({
  type: JiraActions.GET_PROJECT_ASSOCIATION_ERROR
});

const getProjectAssociation = projectId => {
  const URL = `${API_URL}/jira/getProjectAssociation?projectId=${projectId}`;
  return dispatch => {
    dispatch(startLoading());
    dispatch(getProjectAssociationStart());
    return axios
      .get(URL)
      .then(response => {
        if (response && response.status === 200) {
          dispatch(getProjectAssociationSuccess(response.data));
        }
        dispatch(finishLoading());
        return response.data;
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(getProjectAssociationError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

const cleanJiraAssociation = simtrackProjectId => {
  const URL = `${API_URL}/jira/cleanProjectAssociation/${simtrackProjectId}`;
  return dispatch => {
    dispatch(startLoading());
    return axios
      .get(URL)
      .then(response => {
        if (response && response.status === 200) {
          dispatch(cleanJiraAssociationSuccess(simtrackProjectId));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(getProjectAssociationError(error.response.data));
        dispatch(finishLoading());
        throw error;
      });
  };
};

export {
  cleanJiraAssociation,
  jiraAuthorize,
  associateWithJiraProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation
};
