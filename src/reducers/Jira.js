import * as JiraActions from '../constants/Jira';

const InitialState = {
  projects: []
};

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

    case JiraActions.JIRA_ASSOCIATE_PROJECT_START:
      return {
        ...state,
        isJiraCreateProjectStart: true
      };

    case JiraActions.JIRA_ASSOCIATE_PROJECT_SUCCESS:
      return {
        ...state,
        isJiraCreateProjectSuccess: true
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

    // ------------------

    case JiraActions.GET_SIMTRACK_USERS_BY_NAME_START:
      return {
        ...state,
        isGetSimtrackUsersByNameStart: true
      };

    case JiraActions.GET_SIMTRACK_USERS_BY_NAME_SUCCESS:
      return {
        ...state,
        isGetSimtrackUsersByNameSuccess: true,
        simtrackUsers: [...action.simtrackUsers]
      };
    case JiraActions.GET_SIMTRACK_USERS_BY_NAME_ERROR:
      return {
        ...state,
        isGetSimtrackUsersByNameError: true
      };

    // ------------------

    case JiraActions.SET_ASSOCIATION_START:
      return {
        ...state,
        isSetAssociationStart: true
      };

    case JiraActions.SET_ASSOCIATION_SUCCESS:
      return {
        ...state,
        isSetAssociationSuccess: true,
        associations: [...action.associations]
      };

    case JiraActions.SET_ASSOCIATION_ERROR:
      return {
        ...state,
        isSetAssociationError: true
      };

    // ------------------

    case JiraActions.GET_PROJECT_ASSOCIATION_START:
      return {
        ...state,
        isGetProjectAssociationStart: true
      };

    case JiraActions.GET_PROJECT_ASSOCIATION_SUCCESS:
      return {
        ...state,
        isGetProjectAssociationSuccess: true,
        associations: [...action.associations]
      };

    case JiraActions.GET_PROJECT_ASSOCIATION_ERROR:
      return {
        ...state,
        isGetProjectAssociationError: true
      };
    // ------------------

    default:
      return {
        ...state
      };
  }
}
