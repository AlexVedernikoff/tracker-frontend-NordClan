import { DELETE, GET, POST, PUT, REST_API } from '../constants/RestApi';
import a from '../constants/TestSuiteAction';
import { defaultErrorHandler, defaultExtra as extra, withFinishLoading, withStartLoading } from './Common';

const getAllTestSuitesStart = (projectId) => ({
  type: a.GET_ALL_TEST_SUITES_START,
  payload: projectId,
});

const getAllTestSuitesSuccess = ({ testSuites, projectId }) => ({
  type: a.GET_ALL_TEST_SUITES_SUCCESS,
  payload: { testSuites, projectId },
});

export const getAllTestSuites = (projectId) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite',
        method: GET,
        ...(projectId && { body: { params: { projectId } } }),
        extra,
        start: withStartLoading(() => getAllTestSuitesStart(projectId), true)(dispatch),
        response: responsed => {
          withFinishLoading(response => getAllTestSuitesSuccess({ testSuites: response.data, projectId }), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          defaultErrorHandler(dispatch);
          reject(error);
        }
      });
    });
};

const getTestSuitesReferenceStart = () => ({
  type: a.GET_TEST_SUITES_REFERENCE_START
});

const getTestSuitesReferenceSuccess = testSuites => ({
  type: a.GET_TEST_SUITES_REFERENCE_SUCCESS,
  payload: testSuites
});

export const getTestSuitesReference = () => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite/templates',
        method: GET,
        extra,
        start: withStartLoading(getTestSuitesReferenceStart, true)(dispatch),
        response: responsed => {
          withFinishLoading(response => getTestSuitesReferenceSuccess(response.data), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          defaultErrorHandler(dispatch);
          reject(error);
        }
      });
    });
};

const getTestSuiteByIdStart = () => ({
  type: a.GET_TEST_SUITE_BY_ID_START
});

const getTestSuiteByIdSuccess = testSuite => ({
  type: a.GET_TEST_SUITE_BY_ID_SUCCESS,
  testSuite
});

export const getTestSuiteById = id => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-suite/' + id,
      method: GET,
      extra,
      start: withStartLoading(getTestSuiteByIdStart, true)(dispatch),
      response: withFinishLoading(response => getTestSuiteByIdSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

const createTestSuiteStart = () => ({
  type: a.CREATE_TEST_SUITE_START
});

const createTestSuiteSuccess = data => ({
  type: a.CREATE_TEST_SUITE_SUCCESS,
  payload: data
});

export const createTestSuite = params => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite',
        method: POST,
        body: {
          ...params
        },
        extra,
        start: withStartLoading(createTestSuiteStart, true)(dispatch),
        response: response => {
          withFinishLoading(createTestSuiteSuccess(response.data), true)(dispatch)(response);
          resolve(response);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};

const copyTestSuiteStart = () => ({
  type: a.COPY_TEST_SUITE_START
});

const copyTestSuiteSuccess = data => ({
  type: a.COPY_TEST_SUITE_SUCCESS,
  payload: data
});

export const copyTestSuite = params => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite/createProjectTestSuite',
        method: POST,
        body: {
          ...params
        },
        extra,
        start: withStartLoading(copyTestSuiteStart, true)(dispatch),
        response: response => {
          withFinishLoading(copyTestSuiteSuccess(response.data), true)(dispatch)(response);
          resolve(response);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};

const updateTestSuiteStart = () => ({
  type: a.UPDATE_TEST_SUITE_START
});

const updateTestSuiteSuccess = data => ({
  type: a.UPDATE_TEST_SUITE_SUCCESS
});

export const updateTestSuite = (id, params) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite/' + id,
        method: PUT,
        body: {
          ...params
        },
        extra,
        start: withStartLoading(updateTestSuiteStart, true)(dispatch),
        response: response => {
          withFinishLoading(updateTestSuiteSuccess(response.data), true)(dispatch)(response);
          resolve(response);
        },
        error: error => {
          if (error.response.status !== 204) {
            defaultErrorHandler(dispatch)(error);
            reject(error);
          } else {
            withFinishLoading(updateTestSuiteSuccess(error.response.data), true)(dispatch)(error.response);
            resolve(error);
          }
        }
      });
    });
};

const deleteTestSuiteStart = () => ({
  type: a.DELETE_TEST_SUITE_START
});

const deleteTestSuiteSuccess = data => ({
  type: a.DELETE_TEST_SUITE_SUCCESS
});

export const deleteTestSuite = id => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-suite/' + id,
        method: DELETE,
        extra,
        start: withStartLoading(deleteTestSuiteStart, true)(dispatch),
        response: response => {
          withFinishLoading(deleteTestSuiteSuccess(response.data), true)(dispatch)(response);
          resolve(response);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};
