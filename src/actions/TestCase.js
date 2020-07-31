import { defaultErrorHandler, defaultExtra as extra, withFinishLoading, withStartLoading } from './Common';

import { DELETE, GET, POST, PUT, REST_API } from '../constants/RestApi';
import * as testCaseActions from '../constants/TestCaseAction';

const getAllTestCasesStart = () => ({
  type: testCaseActions.GET_ALL_TEST_CASES_START
});

const getAllTestCasesSuccess = testCases => ({
  type: testCaseActions.GET_ALL_TEST_CASES_SUCCESS,
  payload: testCases
});

export const getAllTestCases = () => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-case',
        method: GET,
        extra,
        start: withStartLoading(getAllTestCasesStart, true)(dispatch),
        response: responsed => {
          withFinishLoading(response => getAllTestCasesSuccess(response.data), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};

const getTestCaseByIdStart = () => ({
  type: testCaseActions.GET_TEST_CASE_BY_ID_START
});

const getTestCaseByIdSuccess = testCase => ({
  type: testCaseActions.GET_TEST_CASE_BY_ID_SUCCESS,
  payload: testCase
});

export const getTestCaseById = id => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: `/test-case/${id}`,
      method: GET,
      extra,
      start: withStartLoading(getTestCaseByIdStart, true)(dispatch),
      response: withFinishLoading(response => getTestCaseByIdSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

const createTestCaseStart = () => ({
  type: testCaseActions.CREATE_TEST_CASE_START
});

const createTestCaseSuccess = data => ({
  type: testCaseActions.CREATE_TEST_CASE_SUCCESS,
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
          testCaseSteps: params.steps || params.testCaseSteps,
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
  type: testCaseActions.UPDATE_TEST_CASE_START
});

const updateTestCaseSuccess = () => ({
  type: testCaseActions.UPDATE_TEST_CASE_SUCCESS
});

export const updateTestCase = (id, params) => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: `/test-case/${id}`,
      method: PUT,
      body: {
        title: params.title,
        description: params.description,
        status: params.status,
        statusId: params.statusId,
        severity: params.severity,
        severityId: params.severityId,
        priority: params.priority,
        preConditions: params.preConditions,
        postConditions: params.postConditions,
        duration: params.duration,
        testCaseSteps: params.steps || params.testCaseSteps,
        testSuiteId: params.testSuiteId,
        authorId: params.userId || params.authorId
      },
      extra,
      start: withStartLoading(updateTestCaseStart, true)(dispatch),
      response: withFinishLoading(response => updateTestCaseSuccess(response.data), true)(dispatch),
      error: error => {
        if (error.response.status !== 204) defaultErrorHandler(dispatch)(error);
        else {
          withFinishLoading(response => updateTestCaseSuccess(response.data), true)(dispatch)(error);
        }
      }
    });
};

const deleteTestCaseStart = () => ({
  type: testCaseActions.DELETE_TEST_CASE_START
});

const deleteTestCaseSuccess = () => ({
  type: testCaseActions.DELETE_TEST_CASE_SUCCESS
});

export const deleteTestCase = id => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: `/test-case/${id}`,
      method: DELETE,
      extra,
      start: withStartLoading(deleteTestCaseStart, true)(dispatch),
      response: withFinishLoading(response => deleteTestCaseSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};
