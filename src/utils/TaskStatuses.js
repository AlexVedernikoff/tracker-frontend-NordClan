import { TASK_STATUSES } from '../constants/TaskStatuses';

export const getStatusNameById = statusId => {
  let status;

  switch (statusId) {
    case TASK_STATUSES.NEW:
      status = 'New';
      break;
    case TASK_STATUSES.DEV_PLAY:
      status = 'Develop'; // Develop play
      break;
    case TASK_STATUSES.DEV_STOP:
      status = 'Develop'; // Develop stop
      break;
    case TASK_STATUSES.CODE_REVIEW_PLAY:
      status = 'Code Review'; // Code Review play
      break;
    case TASK_STATUSES.CODE_REVIEW_STOP:
      status = 'Code Review'; // Code Review stop
      break;
    case TASK_STATUSES.QA_PLAY:
      status = 'QA'; // QA play
      break;
    case TASK_STATUSES.QA_STOP:
      status = 'QA'; // QA stop
      break;
    case TASK_STATUSES.DONE:
      status = 'Done';
      break;
    case TASK_STATUSES.CANCELED:
      status = 'Canceled';
      break;
    case TASK_STATUSES.CLOSED:
      status = 'Closed';
      break;
    default:
      break;
  }
  return status;
};

export const isTaskInWork = statusId =>
  statusId !== TASK_STATUSES.NEW &&
  statusId !== TASK_STATUSES.DONE &&
  statusId !== TASK_STATUSES.CLOSED &&
  statusId !== TASK_STATUSES.CANCELED;

export const isTaskInProgress = statusId =>
  statusId === TASK_STATUSES.CODE_REVIEW_PLAY || statusId === TASK_STATUSES.DEV_PLAY || statusId === TASK_STATUSES.QA_PLAY;

export const isTaskInHold = statusId =>
  statusId === TASK_STATUSES.DEV_STOP || statusId === TASK_STATUSES.CODE_REVIEW_STOP || statusId === TASK_STATUSES.QA_STOP;
