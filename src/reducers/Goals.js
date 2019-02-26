import * as GoalsActions from '../constants/Goals';

const InitialState = {
  goals: [],
  isReceiving: false,
  isFetching: false,
  isSuccess: false,
  errorCreateGoal: [],
  errorsMessage: {}
};

function Goals(state = InitialState, action) {
  switch (action.type) {
    case GoalsActions.GOALS_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case GoalsActions.GOALS_LIST_RECEIVE_SUCCESS:
      return {
        ...state,
        goals: action.data,
        isReceiving: false
      };

    case GoalsActions.CLEAR_GOALS:
      return {
        ...InitialState
      };

    case GoalsActions.EDIT_GOAL_START:
    case GoalsActions.CREATE_GOAL_START:
      return {
        ...state,
        isFetching: true,
        isSuccess: false,
        errorCreateGoal: []
      };

    case GoalsActions.CREATE_GOAL:
      const { goals } = state;
      goals.push(action.data);
      return {
        ...state,
        goals,
        isFetching: false,
        isSuccess: true,
        errorCreateGoal: []
      };

    case GoalsActions.CREATE_GOAL_ERROR:
      const errorsMessage = {};
      action.error.forEach(item => {
        errorsMessage[item.type] = item.msg;
      });
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        errorCreateGoal: errorsMessage
      };

    case GoalsActions.EDIT__GOAL:
      const { data } = action;
      console.log('data', data);
      return {
        ...state,
        goals: state.goals.map(goal => (goal.id === data.id ? data : goal)),
        isFetching: false,
        isSuccess: true,
        errorCreateGoal: []
      };
    default:
      return state;
  }
}

export default Goals;
