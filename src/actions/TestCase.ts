import { defaultErrorHandler, defaultExtra as extra, withFinishLoading, withStartLoading } from './Common';
import axios from 'axios';

import { DELETE, GET, POST, PUT, REST_API } from '../constants/RestApi';
import * as testCaseActions from '../constants/TestCaseAction';
import { withdefaultExtra } from './Common';
import { API_URL } from '../constants/Settings';

const getAllTestCasesStart = (projectId) => ({
  type: testCaseActions.GET_ALL_TEST_CASES_START,
  payload: projectId,
});

const getAllTestCasesSuccess = ({ testCases, projectId }) => ({
  type: testCaseActions.GET_ALL_TEST_CASES_SUCCESS,
  payload: { testCases, projectId },
});

export const getAllTestCases = (projectId) => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-case',
        method: GET,
        ...(projectId && { body: { params: { projectId } } }),
        extra,
        start: withStartLoading(() => getAllTestCasesStart(projectId), true)(dispatch),
        response: responsed => {
          withFinishLoading(response => getAllTestCasesSuccess({ testCases: response.data, projectId }), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};
const getTestCasesReferenceStart = () => ({
  type: testCaseActions.GET_TEST_CASES_REFERENCE_START
});

const getTestCasesReferenceSuccess = testCases => ({
  type: testCaseActions.GET_TEST_CASES_REFERENCE_SUCCESS,
  payload: testCases
});

export const getTestCasesReference = () => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-case/templates',
        method: GET,
        extra,
        start: withStartLoading(getTestCasesReferenceStart, true)(dispatch),
        response: responsed => {
          withFinishLoading(response => getTestCasesReferenceSuccess(response.data), true)(dispatch)(responsed);
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
          projectId: params.projectId,
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

const copyTestCaseStart = () => ({
  type: testCaseActions.COPY_TEST_CASE_START
});

const copyTestCaseSuccess = data => ({
  type: testCaseActions.COPY_TEST_CASE_SUCCESS,
  payload: data
});

export const copyTestCase = params => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/test-case/createProjectTestCase',
        method: POST,
        body: params,
        extra,
        start: withStartLoading(copyTestCaseStart, true)(dispatch),
        response: response => {
          withFinishLoading(copyTestCaseSuccess(response.data), true)(dispatch)(response);
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

const updateTestCaseSuccess = data => ({
  type: testCaseActions.UPDATE_TEST_CASE_SUCCESS
});

export const updateTestCase = (id, params) => {
  return dispatch =>
    new Promise((resolve, reject) => {
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
          projectId: params.projectId,
          authorId: params.userId || params.authorId
        },
        extra,
        start: withStartLoading(updateTestCaseStart, true)(dispatch),
        response: responsed => {
          withFinishLoading(response => updateTestCaseSuccess(response.data), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          if (error.response.status !== 204) {
            defaultErrorHandler(dispatch)(error);
            reject(error);
          } else {
            withFinishLoading(response => updateTestCaseSuccess(response.data), true)(dispatch)(error);
            resolve(error);
          }
        }
      });
    });
};

const deleteTestCaseStart = () => ({
  type: testCaseActions.DELETE_TEST_CASE_START
});

const deleteTestCaseSuccess = data => ({
  type: testCaseActions.DELETE_TEST_CASE_SUCCESS
});

export const deleteTestCase = id => {
  return dispatch =>
    new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: `/test-case/${id}`,
        method: DELETE,
        extra,
        start: withStartLoading(deleteTestCaseStart, true)(dispatch),
        response: responsed => {
          withFinishLoading(response => deleteTestCaseSuccess(response.data), true)(dispatch)(responsed);
          resolve(responsed);
        },
        error: error => {
          defaultErrorHandler(dispatch)(error);
          reject(error);
        }
      });
    });
};

const attachmentUploadStarted = (id, attachment) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_UPLOAD_REQUEST,
  id,
  attachment
});

const attachmentUploadProgress = (id, attachment, progress) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_UPLOAD_PROGRESS,
  id,
  attachment,
  progress
});

const attachmentUploadSuccess = (id, attachment, result) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_UPLOAD_SUCCESS,
  id,
  attachment,
  result
});

const attachmentUploadFail = (id, attachment, error) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_UPLOAD_FAIL,
  id,
  attachment,
  error
});

export const uploadAttachments = (id, attachments, addedCallback) => {
  return dispatch => {
    attachments.map(file => {
      const data = new FormData();
      data.append('file', file);

      const attachment = {
        id: `${Date.now()}${Math.random()}`,
        fileName: file.name
      };

      return dispatch({
        type: REST_API,
        url: `/test-case/${id}/attachment`,
        method: POST,
        body: data,
        extra: withdefaultExtra({
          onUploadProgress: progressEvent => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            dispatch(attachmentUploadProgress(id, attachment, progress));
          }
        }),
        start: () => withStartLoading(attachmentUploadStarted, true)(dispatch)(id, attachment),
        response: result => {
          withFinishLoading(attachmentUploadSuccess, true)(dispatch)(id, attachment, result);
          addedCallback(result.data);
        },
        error: error => withFinishLoading(attachmentUploadFail, true)(dispatch)(id, attachment, error)
      });
    });
  };
};

const startRemoveAttachment = (projectId, attachmentId) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_REMOVE_REQUEST,
  projectId,
  attachmentId
});

const successRemoveAttachment = (projectId, attachmentId, result) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_REMOVE_SUCCESS,
  projectId,
  attachmentId,
  result
});

const failRemoveAttachment = (projectId, attachmentId, error) => ({
  type: testCaseActions.TEST_CASE_ATTACHMENT_REMOVE_FAIL,
  projectId,
  attachmentId,
  error
});

export const removeAttachment = (id, attachmentId) => {
  if (!id || !attachmentId) {
    return () => {};
  }

  const URL = `${API_URL}/test-case/${id}/attachment/${attachmentId}`;
  return dispatch => {
    dispatch(startRemoveAttachment(id, attachmentId));
    axios.delete(URL).then(
      result => {
        return dispatch(successRemoveAttachment(id, attachmentId, result));
      },
      error => dispatch(failRemoveAttachment(id, attachmentId, error))
    );
  };
};
