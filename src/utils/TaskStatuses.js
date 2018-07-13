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

export const isTaskInWork = statusId =>
  statusId !== taskStatus.NEW &&
  statusId !== taskStatus.DONE &&
  statusId === taskStatus.CLOSED &&
  statusId === taskStatus.CANCELED;

export const isTaskInProgress = statusId =>
  statusId === taskStatus.CODE_REVIEW_PLAY || statusId === taskStatus.DEV_PLAY || statusId === taskStatus.QA_PLAY;

export const isTaskInHold = statusId =>
  statusId === taskStatus.DEV_STOP || statusId === taskStatus.CODE_REVIEW_STOP || statusId === taskStatus.QA_STOP;
