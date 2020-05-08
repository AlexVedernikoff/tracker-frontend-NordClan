export const DRAFT = 1;
export const NEEDS_WORK = 2;
export const ACTUAL = 3;

export const TEST_TASK_STATUSES = {
  DRAFT,
  NEEDS_WORK,
  ACTUAL
};

export const TASK_STATUSES_TITLES = {
  [TEST_TASK_STATUSES.DRAFT]: 'Draft',
  [TEST_TASK_STATUSES.NEEDS_WORK]: 'Needs work',
  [TEST_TASK_STATUSES.ACTUAL]: 'Actual'
};
