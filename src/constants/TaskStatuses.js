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

export const TASK_TATUSES_TITLES = {
  [TASK_STATUSES.NEW]: 'New',
  [TASK_STATUSES.DEV_PLAY]: 'Develop',
  [TASK_STATUSES.DEV_STOP]: 'Develop',
  [TASK_STATUSES.CODE_REVIEW_PLAY]: 'Code Review',
  [TASK_STATUSES.CODE_REVIEW_STOP]: 'Code Review',
  [TASK_STATUSES.QA_PLAY]: 'QA',
  [TASK_STATUSES.QA_STOP]: 'QA',
  [TASK_STATUSES.DONE]: 'Done',
  [TASK_STATUSES.CANCELED]: 'Canceled',
  [TASK_STATUSES.CLOSED]: 'Closed'
};
