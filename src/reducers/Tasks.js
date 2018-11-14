import * as TasksActions from '../constants/Tasks';
import * as TaskActions from '../constants/Task';
import * as ProjectActions from '../constants/Project';

const InitialState = {
  tasks: [],
  isReceiving: false,
  queryId: null
};

function Tasks(state = InitialState, action) {
  switch (action.type) {
    case TasksActions.TASKS_RECEIVE_START:
      return {
        ...state,
        isReceiving: true,
        queryId: action.data
      };

    case TasksActions.TASKS_RECEIVE_SUCCESS:
      if (action.data.queryId !== state.queryId) {
        return { ...state };
      }
      return {
        ...state,
        tasks: action.data.data,
        isReceiving: false
      };

    case TasksActions.CLEAR_CURRENT_PROJECT_AND_TASKS:
      return {
        ...state,
        tasks: [],
        isReceiving: false
      };

    case ProjectActions.TASK_CREATE_REQUEST_SUCCESS:
      return {
        ...state,
        tasks: [...state.tasks, action.task]
      };

    case TaskActions.TASK_CHANGE_REQUEST_SUCCESS:
      const tasks = state.tasks.map(
        task =>
          task.id === action.changedFields.id
            ? {
                ...task,
                ...action.changedFields
              }
            : task
      );

      return {
        ...state,
        tasks
      };

    default:
      return state;
  }
}

export default Tasks;
