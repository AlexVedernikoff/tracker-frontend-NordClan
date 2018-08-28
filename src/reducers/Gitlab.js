import * as GitlabActions from '../constants/Gitlab';

const InitialState = {
  projects: []
};

export default function Gitlab(state = InitialState, action) {
  switch (action.type) {
    case GitlabActions.ADDING_GITLAB_PROJECT_START:
      return {
        ...state,
        isAddingGitlabProjectStart: true
      };
    case GitlabActions.ADDING_GITLAB_PROJECT_FAIL:
      return {
        ...state,
        isAddingGitlabProjectFail: true
      };
    case GitlabActions.ADDING_GITLAB_PROJECT_SUCCESS:
      return {
        ...state,
        isAddingGitlabProjectSuccess: true,
        gitlabProject: action.payload
      };

    default:
      return {
        ...state
      };
  }
}
