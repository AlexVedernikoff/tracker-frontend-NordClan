import { TEST_CASE_STATUSES } from '../../constants/TestCaseStatuses';
import { TEST_CASE_SEVERITIES } from '../../constants/TestCaseSeverities';

export const TestCaseStatusesDictionary = {
  en: {
    DRAFT: 'Draft',
    NEEDS_WORK: 'Needs Work',
    ACTUAL: 'Actual'
  },
  ru: {
    DRAFT: 'Драфт',
    NEEDS_WORK: 'Требует доработки',
    ACTUAL: 'Активный'
  }
};

export const TestCaseSeveritiesDictionary = {
  en: {
    DRAFT: 'Draft',
    NEEDS_WORK: 'Needs Work',
    ACTUAL: 'Actual'
  },
  ru: {
    DRAFT: 'Драфт',
    NEEDS_WORK: 'Требует доработки',
    ACTUAL: 'Активный'
  }
};

export const testCaseStatusesEnumMock = [
  { id: TEST_CASE_STATUSES.DRAFT, codename: 'DRAFT' },
  { id: TEST_CASE_STATUSES.NEEDS_WORK, codename: 'NEEDS_WORK' },
  { id: TEST_CASE_STATUSES.ACTUAL, codename: 'ACTUAL' }
];

export const testCaseSeveritiesEnumMock = [
  { id: TEST_CASE_SEVERITIES.NOT_SET, codename: 'NOT_SET' },
  { id: TEST_CASE_SEVERITIES.BLOCKER, codename: 'BLOCKER' },
  { id: TEST_CASE_SEVERITIES.CRITICAL, codename: 'CRITICAL' },
  { id: TEST_CASE_SEVERITIES.MAJOR, codename: 'MAJOR' },
  { id: TEST_CASE_SEVERITIES.NORMAL, codename: 'NORMAL' },
  { id: TEST_CASE_SEVERITIES.MINOR, codename: 'MINOR' },
  { id: TEST_CASE_SEVERITIES.TRIVIAL, codename: 'TRIVIAL' }
];

export const getLocalizedTestTaskStasuses = state =>
  testCaseStatusesEnumMock.map(props => ({
    name: TestCaseStatusesDictionary[state.Localize.lang][props.codename],
    ...props
  }));

export const getLocalizedTestTaskSeverities = state =>
  testCaseStatusesEnumMock.map(props => ({
    name: TestCaseStatusesDictionary[state.Localize.lang][props.codename],
    ...props
  }));
