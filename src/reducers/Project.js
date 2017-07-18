import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';
import * as SprintActions from '../constants/Sprint';

const InitialState = {
  project: {
    sprints: [],
    users: []
  },
  TitleIsEditing: false,
  DescriptionIsEditing: false,
  isCreateTaskModalOpen: false
};

export default function Project (state = InitialState, action) {
  switch (action.type) {
    case SprintActions.SPRINTS_EDIT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          sprints: action.sprints
        }
      };

    case SprintActions.SPRINTS_CREATE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          sprints: action.sprints
        }
      };

    case SprintActions.SPRINTS_DELETE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          sprints: action.sprints
        }
      };

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

    case ProjectActions.PROJECT_USERS_RECEIVE_START:
      return {
        ...state
      };

    case ProjectActions.PROJECT_USERS_RECEIVE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          users: action.users
        }
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

    case ProjectActions.OPEN_CREATE_TASK_MODAL:
      return {
        ...state,
        isCreateTaskModalOpen: true
      }

    case ProjectActions.CLOSE_CREATE_TASK_MODAL:
      return {
        ...state,
        isCreateTaskModalOpen: false
      }

    case ProjectActions.TASK_CREATE_REQUEST_START:
      return {
        ...state
      }

    case ProjectActions.TASK_CREATE_REQUEST_SUCCESS:
      return {
        ...state
      }

    default:
      return {
        ...state
      };
  }
}
