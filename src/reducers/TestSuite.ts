import * as TestSuiteActions from '../constants/TestSuiteAction';

const initialState = {
  testSuites: []
};

function TestSuite(state = initialState, action) {
  switch (action.type) {
    case TestSuiteActions.GET_ALL_TEST_SUITES_START:
      return { ...state, isLoading: true };
    case TestSuiteActions.GET_ALL_TEST_SUITES_SUCCESS:
      return { ...state, isLoading: false, testSuites: action.payload };
    case TestSuiteActions.CREATE_TEST_SUITE_START:
      return { ...state, isLoading: true };
    case TestSuiteActions.CREATE_TEST_SUITE_SUCCESS:
      return { ...state, isLoading: false };
    default:
      return { ...state };
  }
}

export default TestSuite;
