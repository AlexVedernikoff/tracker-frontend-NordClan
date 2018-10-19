import * as JiraActions from '../constants/Jira';

const InitialState = {};

export default function Gitlab(state = InitialState, action) {
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

    default:
      return {
        ...state
      };
  }
}
