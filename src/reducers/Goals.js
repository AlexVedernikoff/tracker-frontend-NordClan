import * as GoalsActions from '../constants/Goals';

const InitialState = {
  goals: [],
  isReceiving: false,
  isFetching: false,
  isSuccess: false,
  errorCreateGoal: [],
  errorsMessage: {},
  modifyId: null
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
        errorCreateGoal: [],
        modifyId: null
      };

    case GoalsActions.CREATE_GOAL:
      const { goals } = state;
      return {
        ...state,
        goals: goals.concat(action.data),
        isFetching: false,
        isSuccess: true,
        errorCreateGoal: [],
        modifyId: action.data.id
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
      return {
        ...state,
        goals: state.goals.map(goal => (goal.id === data.id ? data : goal)),
        isFetching: false,
        isSuccess: true,
        errorCreateGoal: [],
        modifyId: data.id
      };
    default:
      return state;
  }
}

export default Goals;
