import * as TasksActions from '../constants/Tasks';
import * as TaskActions from '../constants/Task';
import * as TagsActions from '../constants/Tags';
import * as ProjectActions from '../constants/Project';

const InitialState = {
  tasks: [],
  pageSize: 0,
  pagesCount: 1,
  currentPage: 1,
  tags: '',
  isReceiving: false,
  tagsFilter: []
};

function Tasks (state = InitialState, action) {
  switch (action.type) {
  case TasksActions.TASKS_RECEIVE_START:
    return {
      ...state,
      isReceiving: true
    };

  case TasksActions.TASKS_RECEIVE_SUCCESS:
    return {
      ...state,
      tasks: action.data.data,
      pagesCount: action.data.pagesCount,
      isReceiving: false
    };

  case TasksActions.CLEAR_CURRENT_TASKS:
    return {
      ...state,
      tasks: [],
      pagesCount: 0,
      isReceiving: false
    };

  case ProjectActions.TASK_CREATE_REQUEST_SUCCESS:
    return {
      ...state,
      tasks: [...state.tasks, action.task]
    };

  case TagsActions.GET_TAGS_FILTER_SUCCESS:
    if (action.data.filterFor === 'task') {
      return {
        ...state,
        tagsFilter: action.data.filteredTags
      };
    }
    return {
      ...state
    };

  case TaskActions.TASK_CHANGE_REQUEST_SUCCESS:
    const tasks = state.tasks.map(task => (
      task.id === action.changedFields.id
        ? {
          ...task,
          ...action.changedFields
        }
        : task
    ));

    return {
      ...state,
      tasks
    };

  default:
    return state;
  }
}

export default Tasks;
