import * as TaskActions from '../constants/Tasks';

const InitialState = {
  tasks: [],
  pageSize: 25,
  currentPage: 1,
  tags: '',
  isReceiving: false
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
        isReceiving: false
      };

    default:
      return state;
  }
}

export default Tasks;
