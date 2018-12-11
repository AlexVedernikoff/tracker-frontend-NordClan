export const NEW = 1;
export const DEV_PLAY = 2;
export const DEV_STOP = 3;
export const CODE_REVIEW_PLAY = 4;
export const CODE_REVIEW_STOP = 5;
export const QA_PLAY = 6;
export const QA_STOP = 7;
export const DONE = 8;
export const CANCELED = 9;
export const CLOSED = 10;

export const TASK_STATUSES = {
  NEW,
  DEV_PLAY,
  DEV_STOP,
  CODE_REVIEW_PLAY,
  CODE_REVIEW_STOP,
  QA_PLAY,
  QA_STOP,
  DONE,
  CANCELED,
  CLOSED
};

//todo: об этом должен знать только сервер
export const TASK_STATUSES_GROUPS = {
  NEW: [NEW],
  DEV: [DEV_PLAY, DEV_STOP],
  CODE_REVIEW: [CODE_REVIEW_PLAY, CODE_REVIEW_STOP],
  QA: [QA_PLAY, QA_STOP],
  DONE: [DONE],
  CANCELED: [CANCELED],
  CLOSED: [CLOSED]
};

export function getStopStatusByGroup(statusId) {
  if (TASK_STATUSES_GROUPS.DEV.indexOf(statusId) !== -1) {
    return DEV_STOP;
  }
  if (TASK_STATUSES_GROUPS.CODE_REVIEW.indexOf(statusId) !== -1) {
    return CODE_REVIEW_STOP;
  }
  if (TASK_STATUSES_GROUPS.QA.indexOf(statusId) !== -1) {
    return QA_STOP;
  }

  return statusId;
}

export function isSameStatuses(statusOne, statusTwo) {
  return statusOne === statusTwo || getStopStatusByGroup(statusOne) === getStopStatusByGroup(statusTwo);
}
