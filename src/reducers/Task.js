import * as TaskActions from '../constants/Task';
import * as TagsActions from '../constants/Tags';

const InitialState = {
  task: {
    tags: []
  },
  TitleIsEditing: false,
  PlanningTimeIsEditing: false,
  SprintIsEditing: false,
  StatusIsEditing: false,
  DescriptionIsEditing: false,
  PriorityIsEditing: false
};

export default function Task (state = InitialState, action) {
  switch (action.type) {
  case TagsActions.TAGS_DELETE_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        tags: action.data.tags
      }
    };
  case TagsActions.TAGS_CREATE_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        tags: action.data.tags
      }
    };
  case TaskActions.GET_TASK_REQUEST_SENT:
    return {
      ...state
    };

  case TaskActions.GET_TASK_REQUEST_SUCCESS:
    return {
      ...state,
      task: action.data
    };

  case TaskActions.TASK_EDIT_START:
    return {
      ...state,
      [`${action.target}IsEditing`]: true
    };

  case TaskActions.TASK_EDIT_FINISH:
    return {
      ...state,
      [`${action.target}IsEditing`]: false
    };

  case TaskActions.TASK_CHANGE_REQUEST_SENT:
    return {
      ...state
    };

  case TaskActions.TASK_CHANGE_REQUEST_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        ...action.changedFields
      }
    };

  case TaskActions.TASK_CHANGE_USER_SENT:
    return {
      ...state,
      task: {
        ...state.task
      }
    };

  case TaskActions.TASK_CHANGE_USER_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        ...action.changedFields
      }
    };

  default:
    return {
      ...state
    };
  }
}
