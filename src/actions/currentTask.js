import types from '../constants/ActionTypes';

export function isCurrentTaskLoaded(state, id) {
  return state.currentTask && state.currentTask.loaded && state.currentTask.data.id === id;
}

export function setCurrentTask(id) {
  return {
    types: [types.LOAD_CURRENT_TASK, types.LOAD_CURRENT_TASK_SUCCESS, types.LOAD_CURRENT_TASK_FAIL],
    promise: (client) => client.get(`/loadTask/${id}`)
  };
}
