import * as TaskActions from '../constants/Task';
import * as TagsActions from '../constants/Tags';

const InitialState = {
  task: {
    tags: [],
    history: []
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
      ...state,
      TitleIsEditing: false,
      PlanningTimeIsEditing: false,
      DescriptionIsEditing: false
    };

  case TaskActions.GET_TASK_REQUEST_SUCCESS:
    return {
      ...state,
      task: {
        ...action.data,
        tags: state.task.tags,
        history: state.task.history
      }
    };

  case TaskActions.GET_TASK_HISTORY_REQUEST_SENT:
    return {
      ...state,
      task: {
        ...state.task,
        history: []
      }
    };

  case TaskActions.GET_TASK_HISTORY_REQUEST_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        history: action.data
      }
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
      ...state
    };

  case TaskActions.TASK_CHANGE_USER_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        ...action.changedFields
      }
    };

  case TaskActions.TASK_LINK_SENT:
    return {
      ...state
    };

  case TaskActions.TASK_LINK_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        linkedTasks: action.linkedTasks
      }
    };

  default:
    return {
      ...state
    };
  }
}
