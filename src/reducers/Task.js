import * as TaskActions from '../constants/Task';

const InitialState = {
  task: {
    tags: []
  },
  TitleIsEditing: false,
  SprintIsEditing: false,
  DescriptionIsEditing: false,
  PriorityIsEditing: false
};

export default function Task (state = InitialState, action) {
  switch (action.type) {
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
      }

    case TaskActions.TASK_EDIT_FINISH:
      return {
        ...state,
        [`${action.target}IsEditing`]: false
      }

    case TaskActions.TASK_CHANGE_REQUEST_SENT:
      return {
        ...state
      }

    case TaskActions.TASK_CHANGE_REQUEST_SUCCESS:
      return {
        ...state,
        task: {
          ...state.task,
          ...action.changedFields
        }
      }

    default:
      return {
        ...state
      };
    }
}
