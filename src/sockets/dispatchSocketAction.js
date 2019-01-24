import { getCommentsByTask } from '../actions/Task';
import * as _ from 'lodash';

const NEED_TO_UPDATE_TASK_COMMENTS = 'NEED_TO_UPDATE_TASK_COMMENTS';

const socketActionDispatcher = {};

socketActionDispatcher[NEED_TO_UPDATE_TASK_COMMENTS] = taskId => getCommentsByTask(taskId);

const taskIdSelector = store => _.get(store.getState(), 'Task.task.id', null);

const dispatchSocketAction = (action, store) => {
  switch (action.type) {
    case NEED_TO_UPDATE_TASK_COMMENTS:
      const taskId = taskIdSelector(store);
      if (taskId && action.data.taskId === taskId) {
        store.dispatch(socketActionDispatcher[NEED_TO_UPDATE_TASK_COMMENTS](taskId));
      }
      break;
    default:
      break;
  }
};

export default dispatchSocketAction;
