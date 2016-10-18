import types from '../constants/ActionTypes';

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

export function toggleTasksGroups() {
  return {
    type: types.TOGGLE_TASKS_GROUPS
  };
}

export function toggleTasksTableLayout() {
  return {
    type: types.TOGGLE_TASKS_TABLE_LAYOUT
  };
}

export function setStatus(id, status) {
  return {
    type: types.SET_CURRENT_TASK_STATUS,
    id: id,
    status: status
  };
}
