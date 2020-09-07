import { TASK_CHANGE_REQUEST_SUCCESS, TASK_CHANGE_USER_SUCCESS, TASK_LINK_SUCCESS } from '../constants/Task';
import { getTaskHistory } from '../actions/Task';

const targetActions = {
  [TASK_CHANGE_REQUEST_SUCCESS]: true,
  [TASK_CHANGE_USER_SUCCESS]: true,
  [TASK_LINK_SUCCESS]: true
};

export const taskUpdate = store => next => action => {
  if (targetActions[action.type]) {
    const {
      routing: { locationBeforeTransitions: location },
      Task: {
        task: { id }
      }
    } = store.getState();
    if (RegExp(`${id}\/history\/?$`).test(location.pathname)) {
      const history = store.getState().Task.history;
      if (history.pageSize && history.currentPage) {
        store.dispatch(getTaskHistory(id, { pageSize: history.pageSize, currentPage: history.currentPage }));
      } else {
        store.dispatch(getTaskHistory(id));
      }
    }
  }
  next(action);
};
