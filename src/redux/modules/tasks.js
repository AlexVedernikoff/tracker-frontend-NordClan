import types from '../../constants/ActionTypes';
import sortOrder from '../../utils/sortOrder';

const initialState = {
  loaded: false,
  data: [],
  filter: {
    search: '',
    field: 'name'
  },
  order: {
    'projectName': sortOrder.DIRECTION.ASC,
    'priority': sortOrder.DIRECTION.ASC,
    'id': sortOrder.DIRECTION.NONE,
    'status': sortOrder.DIRECTION.NONE,
    'creatorName': sortOrder.DIRECTION.NONE,
    'planEndDate': sortOrder.DIRECTION.NONE
  }
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
        filter: {
          ...state.filter,
          search: action.searchString,
        }
      };
    case types.SET_TASKS_FILTER_FIELD:
      return {
        ...state,
        filter: {
          ...state.filter,
          field: action.field
        }
      };
    case types.TOGGLE_TASKS_SORT_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          [action.column]: sortOrder.next(state.order[action.column])
        }
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

export function setFilterField(field) {
  return {
    type: types.SET_TASKS_FILTER_FIELD,
    field
  };
}

export function toggleTasksSortOrder(column) {
  return {
    type: types.TOGGLE_TASKS_SORT_ORDER,
    column
  };
}
