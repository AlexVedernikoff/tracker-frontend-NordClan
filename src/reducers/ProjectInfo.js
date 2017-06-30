import * as ProjectInfoActions from "../constants/GetProjectInfo";

const InitialState = {
  project: {}
}

export default function ProjectInfo(state = InitialState, action) {
  switch (action.type) {
    case ProjectInfoActions.PROJECT_INFO_RECEIVE_START:
      return {
        ...state
      }

    case ProjectInfoActions.PROJECT_INFO_RECEIVE_ERROR:
      return {
        ...state,
        errorMessage: action.message
      }

    case ProjectInfoActions.PROJECT_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
        errorMessage: '',
        project: action.project
      }

    default:
      return {
        ...state
      }
  }
}
