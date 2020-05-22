import { TEST_CASE_SEVERITIES } from '../../constants/TestCaseSeverities';
import { TEST_CASE_STATUSES } from '../../constants/TestCaseStatuses';

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
    NOT_SET: 'Not set',
    BLOCKER: 'Blocker',
    CRITICAL: 'Critical',
    MAJOR: 'Major',
    NORMAL: 'Normal',
    MINOR: 'Minor',
    TRIVIAL: 'Trivial'
  },
  ru: {
    NOT_SET: 'Не указан',
    BLOCKER: 'Блокирующий',
    CRITICAL: 'Критичный',
    MAJOR: 'Мажорный',
    NORMAL: 'Нормальный',
    MINOR: 'Минорный',
    TRIVIAL: 'Тривиальный'
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

export const testSuitesMock = [
  { id: 1, title: 'title', description: 'description' },
  { id: 2, title: 'title', description: 'description' },
  { id: 3, title: 'title', description: 'description' },
  { id: 4, title: 'title', description: 'description' }
];

export const getLocalizedTestCaseStatuses = state =>
  testCaseStatusesEnumMock.map(props => ({
    name: TestCaseStatusesDictionary[state.Localize.lang][props.codename],
    ...props
  }));

export const getLocalizedTestCaseSeverities = state =>
  testCaseSeveritiesEnumMock.map(props => ({
    name: TestCaseSeveritiesDictionary[state.Localize.lang][props.codename],
    ...props
  }));
