import * as ProjectActions from "../constants/Project";

const InitialState = {
  project: {}
}

export default function Project(state = InitialState, action) {
  switch (action.type) {
    case ProjectActions.PROJECT_INFO_RECEIVE_START:
      return {
        ...state
      }

    case ProjectActions.PROJECT_INFO_RECEIVE_ERROR:
      return {
        ...state,
        errorMessage: action.message
      }

    case ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
        errorMessage: '',
        project: action.project
      }

    case ProjectActions.PROJECT_CHANGE_START:
      return {
        ...state
      };

    case ProjectActions.PROJECT_CHANGE_ERROR:
      return {
        ...state
      };

    case ProjectActions.PROJECT_CHANGE_SUCCESS:
      console.log(action.changedFields);
      return {
        ...state,
        project: {
          ...state.project,
          ...action.changedFields
        }
      };

    default:
      return {
        ...state
      }
  }
}
