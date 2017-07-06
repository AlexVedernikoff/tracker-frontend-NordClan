import * as TaskActions from '../constants/Task';

const InitialState = {
  task: {},
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

    default:
      return {
        ...state
      };
    }
}
