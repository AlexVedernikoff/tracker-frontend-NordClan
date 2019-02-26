import * as TasksActions from '../constants/Tasks';
import * as TaskActions from '../constants/Task';
import * as ProjectActions from '../constants/Project';
import { isEmpty } from 'lodash';

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
      const tasksToUpdate = {};
      const addTaskToUpdate = (tasks, connectionType) => {
        tasks.forEach(task => {
          tasksToUpdate[task.id] = connectionType;
        });
      };

      if (Array.isArray(action.changedFields.linkedTasks)) {
        addTaskToUpdate(action.changedFields.linkedTasks, 'linkedTasks');
      }

      if (action.changedFields.parentTask) {
        addTaskToUpdate(action.changedFields.parentTask, 'parentTask');
      }

      if (Array.isArray(action.changedFields.subTasks)) {
        addTaskToUpdate(action.changedFields.subTasks, 'subTasks');
      }

      let tasks = [];

      if (isEmpty(tasksToUpdate)) {
        tasks = state.tasks.map(
          task =>
            task.id === action.changedFields.id
              ? {
                  ...task,
                  ...action.changedFields
                }
              : task
        );
      } else {
        tasks = state.tasks.map(task => {
          if (task.id === action.changedFields.id) {
            return {
              ...task,
              ...action.changedFields
            };
          } else if (tasksToUpdate[task.id]) {
            const key = tasksToUpdate[task.id];
            if (Array.isArray(task[key])) {
              const taskIndex = task[key].findIndex(t => (t.id = action.changedFields.id));
              if (taskIndex !== -1) {
                return {
                  ...task,
                  [key]: [
                    ...task[key].slice(0, taskIndex),
                    { ...task[key], ...action.changedFields },
                    ...task[key].slice(taskIndex + 1)
                  ]
                };
              }
            } else if (task[key]) {
              return {
                ...task,
                [key]: {
                  ...task[key],
                  ...action.changedFields
                }
              };
            }
          }

          return task;
        });
      }

      return {
        ...state,
        tasks
      };

    default:
      return state;
  }
}

export default Tasks;
