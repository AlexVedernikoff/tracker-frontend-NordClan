import * as TaskActions from '../constants/Tasks';
import * as TagsActions from '../constants/Tags';

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
  case TaskActions.TASKS_RECEIVE_START:
    return {
      ...state,
      isReceiving: true
    };

    case TaskActions.TASKS_RECEIVE_SUCCESS:
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

  default:
    return state;
  }
}

export default Tasks;
