import * as TasksActions from '../constants/Tasks';
import * as TagsActions from '../constants/Tags';
import * as TaskActions from '../constants/Task';
import { ITaskListStore } from '~/store/store.type';

const InitialState: ITaskListStore = {
  tasks: [] as any[],
  pagesCount: 1,
  isReceiving: false,
  tagsFilter: [] as any[],
  allTags: [] as any[]
};

function Tasks(state = InitialState, action): ITaskListStore {
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
        allTags: action.data.allTags,
        isReceiving: false
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
