import { TASK_CHANGE_REQUEST_SUCCESS, TASK_CHANGE_USER_SUCCESS, TASK_LINK_SUCCESS } from '../constants/Task';
import { getTaskHistory } from '../actions/Task';

const targetActions = {
  [TASK_CHANGE_REQUEST_SUCCESS]: true,
  [TASK_CHANGE_USER_SUCCESS]: true,
  [TASK_LINK_SUCCESS]: true
};

export const taskUpdate = store => next => action => {
  if (targetActions[action.type]) {
    const { routing: { locationBeforeTransitions: location }, Task: { task: { id } } } = store.getState();
    if (RegExp(`${id}\/history\/?$`).test(location.pathname)) {
      store.getState().Task.history && store.getState().Task.history.pageSize
        ? store.dispatch(getTaskHistory(id, { pageSize: store.getState().Task.history.pageSize }))
        : store.dispatch(getTaskHistory(id));
    }
  }
  next(action);
};
