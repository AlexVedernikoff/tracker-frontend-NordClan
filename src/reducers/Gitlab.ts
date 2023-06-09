import { IGitlabStore } from '~/store/store.type';
import * as GitlabActions from '../constants/Gitlab';

const InitialState: IGitlabStore = {
  projects: []
};

export default function Gitlab(state = InitialState, action): IGitlabStore {
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
        gitlabProject: action.project.gitlabProject
      };

    case GitlabActions.GET_GITLAB_NAMESPACES_SUCCESS:
      return {
        ...state,
        gitlabNamespaces: action.namespaces
      };

    default:
      return {
        ...state
      };
  }
}
