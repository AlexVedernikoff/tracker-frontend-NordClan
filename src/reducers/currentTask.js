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
    case types.SET_CURRENT_TASK_PRIORITY:
      return {
        ...state,
        data: {
          ...state.data,
          priority: action.id
        }
      };
    case types.SET_CURRENT_TYPE_TASK:
      return {
        ...state,
        data: {
          ...state.data,
          type: action.id
        }
      };

    case types.SET_CURRENT_TASK_STATUS:
      return {
        ...state,
        data: {
          ...state.data,
          status: action.id
        }
      };
    default:
      return state;
  }
}
