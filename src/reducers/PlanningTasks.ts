import { IPlanningTasksStore } from '~/store/store.type';
import * as PlanningTaskActions from '../constants/PlanningTasks';

const InitialState: IPlanningTasksStore = {
  leftColumnTasks: {
    data: []
  },
  rightColumnTasks: {
    data: []
  },
  isReceiving: false
};

function PlanningTasks(state = InitialState, action): IPlanningTasksStore {
  switch (action.type) {
    case PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case PlanningTaskActions.LEFT_COLUMN_TASKS_RECEIVE_SUCCESS:
      return {
        ...state,
        leftColumnTasks: action.data,
        isReceiving: false
      };

    case PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case PlanningTaskActions.RIGHT_COLUMN_TASKS_RECEIVE_SUCCESS:
      return {
        ...state,
        rightColumnTasks: action.data,
        isReceiving: false
      };

    default:
      return state;
  }
}

export default PlanningTasks;
