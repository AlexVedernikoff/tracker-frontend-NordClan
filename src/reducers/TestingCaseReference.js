import * as TestCaseActions from '../constants/TestCaseAction';

const initialState = {
  isLoading: false,
  testCases: {}
};

function TestingCaseReference(state = initialState, action) {
  switch (action.type) {
    case TestCaseActions.GET_ALL_TEST_CASES_START:
      return {
        ...state,
        isLoading: true
      };
    case TestCaseActions.GET_ALL_TEST_CASE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        testCases: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

export default TestingCaseReference;
