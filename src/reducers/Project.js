import * as ProjectActions from "../constants/Project";

const InitialState = {
  project: {},
  TitleIsEditing: false,
  DescriptionIsEditing: false
}

export default function Project(state = InitialState, action) {
  switch (action.type) {
    case ProjectActions.PROJECT_INFO_RECEIVE_START:
      return {
        ...state
      }

    case ProjectActions.PROJECT_INFO_RECEIVE_ERROR:
      return {
        ...state
      }

    case ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
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
      return {
        ...state,
        project: {
          ...state.project,
          ...action.changedFields
        }
      };

    case ProjectActions.EDIT_START:
      return {
        ...state,
        [`${action.target}IsEditing`]: true
      }

    case ProjectActions.EDIT_FINISH:
      return {
        ...state,
        [`${action.target}IsEditing`]: false
      }

    default:
      return {
        ...state
      }
  }
}
