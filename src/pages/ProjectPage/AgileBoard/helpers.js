import { TASK_STATUSES } from '../../../constants/TaskStatuses';

export const getNewStatus = newPhase => {
  let newStatusId;

  switch (newPhase) {
    case 'New':
      newStatusId = TASK_STATUSES.NEW;
      break;
    case 'Dev':
      newStatusId = TASK_STATUSES.DEV_STOP;
      break;
    case 'Code Review':
      newStatusId = TASK_STATUSES.CODE_REVIEW_STOP;
      break;
    case 'QA':
      newStatusId = TASK_STATUSES.QA_STOP;
      break;
    case 'Done':
      newStatusId = TASK_STATUSES.DONE;
      break;
    default:
      break;
  }

  return newStatusId;
};

export const getNewStatusOnClick = oldStatusId => {
  let newStatusId;

  if (oldStatusId === TASK_STATUSES.DEV_PLAY || oldStatusId === TASK_STATUSES.CODE_REVIEW_PLAY || oldStatusId === TASK_STATUSES.QA_PLAY) {
    newStatusId = oldStatusId + 1;
  } else if (oldStatusId === TASK_STATUSES.DEV_STOP || oldStatusId === TASK_STATUSES.CODE_REVIEW_STOP || oldStatusId === TASK_STATUSES.QA_STOP) {
    newStatusId = oldStatusId - 1;
  }

  return newStatusId;
};
