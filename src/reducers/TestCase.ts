import * as TestCaseActions from '../constants/TestCaseAction';

const initialState = {
  isLoading: false,
  origin: null,
  list: {
    withTestSuite: {},
    withoutTestSuite: []
  }
};

function TestCase(state = initialState, action) {
  switch (action.type) {
    case TestCaseActions.GET_ALL_TEST_CASES_START:
      return {
        ...state,
        isLoading: true
      };
    case TestCaseActions.GET_ALL_TEST_CASES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        list: action.testCases
      };
    case TestCaseActions.CREATE_TEST_CASE_START:
      return {
        ...state,
        isLoading: true
      };
    case TestCaseActions.CREATE_TEST_CASE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        origin: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

export default TestCase;
