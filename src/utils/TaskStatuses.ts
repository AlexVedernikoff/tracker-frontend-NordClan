import { TASK_STATUSES, TASK_STATUSES_GROUPS } from '../constants/TaskStatuses';

export const isTaskInWork = statusId =>
  statusId !== TASK_STATUSES.NEW &&
  statusId !== TASK_STATUSES.DONE &&
  statusId !== TASK_STATUSES.CLOSED &&
  statusId !== TASK_STATUSES.CANCELED;

export const isTaskInProgress = statusId =>
  statusId === TASK_STATUSES.CODE_REVIEW_PLAY ||
  statusId === TASK_STATUSES.DEV_PLAY ||
  statusId === TASK_STATUSES.QA_PLAY;

export const isTaskInHold = statusId =>
  statusId === TASK_STATUSES.DEV_STOP ||
  statusId === TASK_STATUSES.CODE_REVIEW_STOP ||
  statusId === TASK_STATUSES.QA_STOP;

export function getStopStatusByGroup(statusId) {
  if (TASK_STATUSES_GROUPS.DEV.indexOf(statusId) !== -1) {
    return TASK_STATUSES.DEV_STOP;
  }
  if (TASK_STATUSES_GROUPS.CODE_REVIEW.indexOf(statusId) !== -1) {
    return TASK_STATUSES.CODE_REVIEW_STOP;
  }
  if (TASK_STATUSES_GROUPS.QA.indexOf(statusId) !== -1) {
    return TASK_STATUSES.QA_STOP;
  }

  return statusId;
}

export function isSameStatuses(statusOne, statusTwo) {
  return statusOne === statusTwo || getStopStatusByGroup(statusOne) === getStopStatusByGroup(statusTwo);
}
