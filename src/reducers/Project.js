import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';

const InitialState = {
  project: {},
  TitleIsEditing: false,
  DescriptionIsEditing: false
};

export default function Project (state = InitialState, action) {
  switch (action.type) {
    case TagsActions.TAGS_DELETE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          tags: action.data.tags
        }
      };

    case TagsActions.TAGS_CREATE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          tags: action.data.tags
        }
      };

    case ProjectActions.PROJECT_INFO_RECEIVE_START:
      return {
        ...state
      };

    case ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
        project: action.project
      };

    case ProjectActions.PROJECT_CHANGE_START:
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
      };

    case ProjectActions.EDIT_FINISH:
      return {
        ...state,
        [`${action.target}IsEditing`]: false
      };

    default:
      return {
        ...state
      };
  }
}
