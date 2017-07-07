import * as TaskActions from '../constants/Task';

const InitialState = {
  task: {
    tags: []
  },
  TitleIsEditing: false,
  DescriptionIsEditing: false
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

    default:
      return {
        ...state
      };
    }
}
