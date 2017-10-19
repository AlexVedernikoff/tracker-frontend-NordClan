import * as TasksActions from '../constants/Tasks';
import * as TaskActions from '../constants/Task';
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
    const oldTaskVersion = state.tasks.find(task => {
      return task.id === action.changedFields.id;
    })
    const updatedTaskVersion = {
      ...oldTaskVersion,
      ...action.changedFields
    }

    return {
      ...state,
      tasks: [
        ...state.tasks.filter(task => task.id !== updatedTaskVersion.id),
        updatedTaskVersion
      ]
    };


  default:
    return state;
  }
}

export default Tasks;
