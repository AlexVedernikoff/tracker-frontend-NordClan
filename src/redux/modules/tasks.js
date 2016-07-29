import types from '../../constants/ActionTypes';

const initialState = {
  loaded: false,
  data: [],
  searchString: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_TASKS:
      return {
        ...state,
        loading: true
      };
    case types.LOAD_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case types.LOAD_TASKS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case types.SET_TASKS_SEARCH_STRING:
      return {
        ...state,
        searchString: action.searchString
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.tasks && globalState.tasks.loaded;
}

export function load() {
  return {
    types: [types.LOAD_TASKS, types.LOAD_TASKS_SUCCESS, types.LOAD_TASKS_FAIL],
    promise: (client) => client.get('/loadTasks')
  };
}

export function setSearchString(searchString) {
  return {
    type: types.SET_TASKS_SEARCH_STRING,
    searchString
  };
}
