import * as TestCaseActions from '../constants/TestCaseAction';

const initialState = {
  isLoading: false,
  testCases: { withTestSuite: {}, withoutTestSuite: [] }
};

function TestingCaseReference(state = initialState, action) {
  switch (action.type) {
    case TestCaseActions.GET_ALL_TEST_CASES_SUCCESS:
      return {
        ...state,
        testCases: action.payload
      };
    case TestCaseActions.CREATE_TEST_CASE_SUCCESS:
      return {
        ...state
      };
    default:
      return state;
  }
}

export default TestingCaseReference;
