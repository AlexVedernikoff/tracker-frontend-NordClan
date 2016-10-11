import types from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
  data: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_CURRENT_TASK:
      return {
        ...state,
        loading: true
      };
    case types.LOAD_CURRENT_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case types.LOAD_CURRENT_TASK_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    default:
      return state;
  }
}
