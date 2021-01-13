import { ITestSuiteStore } from '~/store/store.type';
import * as TestSuiteActions from '../constants/TestSuiteAction';

const initialState: ITestSuiteStore = {
  testSuites: [],
  isLoading: false,
  testSuitesByProject: {},
  testSuitesByProjectLoading: {},
  testSuitesReference: [],
  isReferenceLoading: false,
};

function TestSuite(state = initialState, action): ITestSuiteStore {
  switch (action.type) {
    case TestSuiteActions.GET_ALL_TEST_SUITES_START:
      return {
        ...state,
        ...(action.payload.projectId && {
          testSuitesByProjectLoading: {
            ...state.testSuitesByProjectLoading,
            [action.payload.projectId]: true,
          },
        }),
        ...(!action.payload.projectId && {
          isLoading: true,
        }),
      };
    case TestSuiteActions.GET_ALL_TEST_SUITES_SUCCESS:
      return {
        ...state,
        ...(action.payload.projectId && {
          testSuitesByProjectLoading: {
            ...state.testSuitesByProjectLoading,
            [action.payload.projectId]: false,
          },
          testSuitesByProject: {
            ...state.testSuitesByProject,
            [action.payload.projectId]: action.payload.testSuites
          }
        }),
        ...(!action.payload.projectId && {
          isLoading: false,
          testSuites: action.payload.testSuites,
        }),
      };

    case TestSuiteActions.CREATE_TEST_SUITE_START:
      return { ...state, isLoading: true };
    case TestSuiteActions.CREATE_TEST_SUITE_SUCCESS:
      return { ...state, isLoading: false };

    case TestSuiteActions.GET_TEST_SUITES_REFERENCE_START:
      return { ...state, isReferenceLoading: true };
    case TestSuiteActions.GET_TEST_SUITES_REFERENCE_SUCCESS:
      return { ...state, isReferenceLoading: false, testSuitesReference: action.payload };

    default:
      return { ...state };
  }
}

export default TestSuite;
