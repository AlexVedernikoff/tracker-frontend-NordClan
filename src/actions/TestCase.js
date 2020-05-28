import { DELETE, GET, POST, PUT, REST_API } from '../constants/RestApi';
import a from '../constants/TestCaseAction';
import { defaultErrorHandler, defaultExtra as extra, withFinishLoading, withStartLoading } from './Common';

const getAllTestCasesStart = () => ({
  type: a.GET_ALL_TEST_CASES_START
});

const getAllTestCasesSuccess = testCases => ({
  type: a.GET_ALL_TEST_CASES_SUCCESS,
  payload: testCases
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
  payload: testCase
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

const createTestCaseStart = () => ({
  type: a.CREATE_TEST_CASE_START
});

const createTestCaseSuccess = data => ({
  type: a.CREATE_TEST_CASE_SUCCESS,
  payload: data
});

export const createTestCase = params => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-case',
        method: POST,
        body: {
          title: params.title,
          description: params.description,
          statusId: params.statusId,
          severityId: params.severityId,
          priority: params.priority,
          preConditions: params.preConditions,
          postConditions: params.postConditions,
          duration: params.duration,
          testCaseSteps: params.steps,
          testSuiteId: params.testSuiteId,
          authorId: params.authorId
        },
        extra,
        start: withStartLoading(createTestCaseStart, true)(dispatch),
        response: response => {
          withFinishLoading(createTestCaseSuccess(response.data), true)(dispatch)(response);
          resolve(response);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
  };
};

const updateTestCaseStart = () => ({
  type: a.UPDATE_TEST_CASE_START
});

const updateTestCaseSuccess = () => ({
  type: a.UPDATE_TEST_CASE_SUCCESS
});

export const updateTestCase = (id, params) => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case/' + id,
      method: PUT,
      body: {
        title: params.title,
        description: params.description,
        status: params.status,
        severity: params.severity,
        priority: params.priority,
        preConditions: params.preConditions,
        postConditions: params.postConditions,
        duration: params.duration,
        testCaseSteps: params.steps,
        testSuiteId: params.testSuiteId,
        authorId: params.userId
      },
      extra,
      start: withStartLoading(updateTestCaseStart, true)(dispatch),
      response: withFinishLoading(response => updateTestCaseSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

const deleteTestCaseStart = () => ({
  type: a.DELETE_TEST_CASE_START
});

const deleteTestCaseSuccess = () => ({
  type: a.DELETE_TEST_CASE_SUCCESS
});

export const deleteTestCase = id => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case/' + id,
      method: DELETE,
      extra,
      start: withStartLoading(deleteTestCaseStart, true)(dispatch),
      response: withFinishLoading(response => deleteTestCaseSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};
