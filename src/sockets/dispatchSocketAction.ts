import { getCommentsByTask } from '../actions/Task';
import { getJiraSyncInfo } from '../actions/Jira';
import * as _ from 'lodash';

const NEED_TO_UPDATE_TASK_COMMENTS = 'NEED_TO_UPDATE_TASK_COMMENTS';
const NEED_TO_UPDATE_JIRA_STATUS = 'NEED_TO_UPDATE_JIRA_STATUS';

const socketActionDispatcher = {};

socketActionDispatcher[NEED_TO_UPDATE_TASK_COMMENTS] = taskId => getCommentsByTask(taskId);
socketActionDispatcher[NEED_TO_UPDATE_JIRA_STATUS] = simtrackProjectId => getJiraSyncInfo(simtrackProjectId);

const taskIdSelector = store => _.get(store.getState(), 'Task.task.id', null);
const simtrackProjectSelector = store => _.get(store.getState(), 'Project.project.id');

const dispatchSocketAction = (action, store) => {
  switch (action.type) {
    case NEED_TO_UPDATE_TASK_COMMENTS:
      const taskId = taskIdSelector(store);
      if (taskId && action.data.taskId === taskId) {
        store.dispatch(socketActionDispatcher[NEED_TO_UPDATE_TASK_COMMENTS](taskId));
      }
      break;
    case NEED_TO_UPDATE_JIRA_STATUS:
      const simtrackProjectId = simtrackProjectSelector(store);
      if (simtrackProjectId && action.data.simtrackProjectId === simtrackProjectId) {
        store.dispatch(socketActionDispatcher[NEED_TO_UPDATE_JIRA_STATUS](simtrackProjectId));
      }
      break;
    default:
      break;
  }
};

export default dispatchSocketAction;
