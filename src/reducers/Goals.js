import * as GoalsActions from '../constants/Goals';

const InitialState = {
  goals: [],
  isReceiving: false,
  isSuccessCreate: false,
  isErrorCreateGoal: null
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

    case GoalsActions.CREATE_GOAL_START:
      return {
        ...state,
        isSuccessCreate: false,
        isErrorCreateGoal: null
      };

    case GoalsActions.CREATE_GOAL:
      const { goals } = state;
      goals.push(action.data);
      return {
        ...state,
        goals,
        isSuccessCreate: true,
        isErrorCreateGoal: null
      };

    case GoalsActions.CREATE_GOAL_ERROR:
      return {
        ...state,
        isSuccessCreate: false,
        isErrorCreateGoal: action.error
      };

    default:
      return state;
  }
}

export default Goals;
