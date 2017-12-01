import * as TasksActions from '../constants/Tasks';
import * as TagsActions from '../constants/Tags';

const InitialState = {
  tasks: [],
  pagesCount: 1,
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

  case TasksActions.TASKS_LIST_RECEIVE_SUCCESS:
    return {
      ...state,
      tasks: action.data.data,
      pagesCount: action.data.pagesCount,
      isReceiving: false
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

  case TasksActions.CLEAR_CURRENT_PROJECT_AND_TASKS:
    return {
      ...InitialState
    };

  default:
    return state;
  }
}

export default Tasks;
