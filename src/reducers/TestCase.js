import * as TestCaseActions from '../constants/TestCaseAction';

const initialState = {
  isLoading: false,
  origin: null
};

function TestCase(state = initialState, action) {
  switch (action.type) {
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
    case TestCaseActions.DELETE_TEST_CASE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

export default TestCase;
