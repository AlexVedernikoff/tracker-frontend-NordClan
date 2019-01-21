import * as GoalsActions from '../constants/Goals';

const InitialState = {
  goals: [],
  isReceiving: false
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

    default:
      return state;
  }
}

export default Goals;
