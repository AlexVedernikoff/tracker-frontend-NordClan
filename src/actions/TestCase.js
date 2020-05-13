import a from '../constants/TestCaseAction';
import { GET, REST_API } from '../constants/RestApi';
import { defaultErrorHandler, withFinishLoading, withStartLoading, defaultExtra as extra } from './Common';

const getAllTestCasesStart = () => ({
  type: a.GET_ALL_TEST_CASES_START
});

const getAllTestCasesSuccess = testCases => ({
  type: a.GET_ALL_TEST_CASES_SUCCESS,
  testCases
});

export const getAllTestCases = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case',
      method: GET,
      extra,
      start: withStartLoading(getAllTestCasesStart, true)(dispatch),
      response: withFinishLoading(response => getAllTestCasesSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

const getTestCaseByIdStart = () => ({
  type: a.GET_TEST_CASE_BY_ID_START
});

const getTestCaseByIdSuccess = testCase => ({
  type: a.GET_TEST_CASE_BY_ID_SUCCESS,
  testCase
});

export const getTestCaseById = id => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case/' + id,
      method: GET,
      extra,
      start: withStartLoading(getTestCaseByIdStart, true)(dispatch),
      response: withFinishLoading(response => getTestCaseByIdSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};
