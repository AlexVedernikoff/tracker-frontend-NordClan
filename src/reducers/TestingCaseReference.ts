import { ITestingCaseReferenceStore } from '~/store/store.type';
import * as TestCaseActions from '../constants/TestCaseAction';

const initialState: ITestingCaseReferenceStore = {
  isLoading: false,
  testCases: { withTestSuite: [], withoutTestSuite: [] },
  testCasesByProject: {},
  testCasesByProjectLoading: {},
  isReferenceLoading: false,
  testCasesReference: { withTestSuite: [], withoutTestSuite: [] },
};

function TestingCaseReference(state = initialState, action): ITestingCaseReferenceStore {
  switch (action.type) {
    case TestCaseActions.GET_ALL_TEST_CASES_START:
      return {
        ...state,
        ...(action.payload.projectId && {
          testCasesByProjectLoading: {
            ...state.testCasesByProjectLoading,
            [action.payload.projectId]: true,
          },
        }),
        ...(!action.payload.projectId && {
          isLoading: true,
        }),
      };
    case TestCaseActions.GET_ALL_TEST_CASES_SUCCESS:
      return {
        ...state,
        ...(action.payload.projectId && {
          testCasesByProjectLoading: {
            ...state.testCasesByProjectLoading,
            [action.payload.projectId]: false,
          },
          testCasesByProject: {
            ...state.testCasesByProject,
            [action.payload.projectId]: action.payload.testCases,
          },
        }),
        ...(!action.payload.projectId && {
          isLoading: false,
          testCases: action.payload.testCases,
        }),
      };

    case TestCaseActions.CREATE_TEST_CASE_SUCCESS:
      return {
        ...state
      };

    case TestCaseActions.GET_TEST_CASES_REFERENCE_START:
      return {
        ...state,
        isReferenceLoading: true,
      };
    case TestCaseActions.GET_TEST_CASES_REFERENCE_SUCCESS:
      return {
        ...state,
        testCasesReference: action.payload,
        isReferenceLoading: false,
      };
    default:
      return state;
  }
}

export default TestingCaseReference;
