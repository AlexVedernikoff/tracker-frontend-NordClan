import * as JiraActions from '../constants/Jira';

const InitialState = {};

export default function Jira(state = InitialState, action) {
  switch (action.type) {
    case JiraActions.JIRA_AUTHORIZE_START:
      return {
        ...state,
        isJiraAuthorizeStart: true
      };

    case JiraActions.JIRA_AUTHORIZE_SUCCESS:
      return {
        ...state,
        isJiraAuthorizeSuccess: true,
        token: action.token
      };
    case JiraActions.JIRA_AUTHORIZE_ERROR:
      return {
        ...state,
        isJiraAuthorizeError: true
      };

    // -----------------

    case JiraActions.JIRA_CREATE_PROJECT_START:
      return {
        ...state,
        isJiraCreateProjectStart: true
      };

    case JiraActions.JIRA_CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        isJiraCreateProjectSuccess: true,
        project: action.project
      };
    case JiraActions.JIRA_CREATE_PROJECT_ERROR:
      return {
        ...state,
        isJiraCreateProjectError: true
      };

    // ------------------

    case JiraActions.GET_JIRA_PROJECTS_START:
      return {
        ...state,
        isGetJiraProjectsStart: true
      };

    case JiraActions.GET_JIRA_PROJECTS_SUCCESS:
      return {
        ...state,
        isGetJiraProjectsSuccess: true,
        projects: [...action.projects]
      };
    case JiraActions.GET_JIRA_PROJECTS_ERROR:
      return {
        ...state,
        isGetJiraProjectsError: true
      };

    default:
      return {
        ...state
      };
  }
}
