import * as ProjectChangeActions from '../actions/ProjectChange';

export default function ProjectChange (state = {}, action) {
  switch (action.type) {
    case ProjectChangeActions.PROJECT_CHANGE_START:
      return {
        ...state
      };

    case ProjectChangeActions.PROJECT_CHANGE_ERROR:
      return {
        ...state
      };

    case ProjectChangeActions.PROJECT_CHANGE_SUCCESS:
      return {
        ...state
      };

    default:
      return {
        ...state
      };
  }
}
