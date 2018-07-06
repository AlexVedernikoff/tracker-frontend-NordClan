import * as taskStatus from '../constants/TaskStatuses';

export const getStatusNameById = statusId => {
  let status;

  switch (statusId) {
    case 1:
      status = 'New';
      break;
    case 2:
      status = 'Develop'; // Develop play
      break;
    case 3:
      status = 'Develop'; // Develop stop
      break;
    case 4:
      status = 'Code Review'; // Code Review play
      break;
    case 5:
      status = 'Code Review'; // Code Review stop
      break;
    case 6:
      status = 'QA'; // QA play
      break;
    case 7:
      status = 'QA'; // QA stop
      break;
    case 8:
      status = 'Done';
      break;
    case 9:
      status = 'Canceled';
      break;
    case 10:
      status = 'Closed';
      break;
    default:
      break;
  }
  return status;
};

export const isTaskInWork = statusId => statusId !== taskStatus.STATUS_NEW && statusId !== taskStatus.STATUS_DONE;

export const isTaskInProgress = statusId =>
  statusId === taskStatus.STATUS_DEV_HOLD ||
  statusId === taskStatus.STATUS_REVIEW_HOLD ||
  statusId === taskStatus.STATUS_QA_HOLD;

export const isTaskInHold = statusId =>
  statusId === taskStatus.STATUS_DEV_PROGRESS ||
  statusId === taskStatus.STATUS_REVIEW_PROGRESS ||
  statusId === taskStatus.STATUS_QA_PROGRESS;
