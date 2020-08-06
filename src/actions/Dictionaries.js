import * as DictionariesActions from '../constants/Dictionaries';
import { GET, REST_API } from '../constants/RestApi';

import {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  defaultBody as body,
  defaultExtra as extra
} from './Common';

const startDictionaryRequest = () => ({
  type: DictionariesActions.GET_DICTIONARY_START
});

const successDictionaryRequest = (dictionary, name) => ({
  type: DictionariesActions.GET_DICTIONARY_SUCCESS,
  name: name,
  data: dictionary
});

export const getRoles = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/dictionary/project/roles',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'roles'), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getMagicActivityTypes = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/task/timesheet/types/dictionary',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'magicActivityTypes'), true)(
        dispatch
      ),
      error: defaultErrorHandler(dispatch)
    });
};

export const getTaskStatuses = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/task/status/dictionary/',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'taskStatuses'), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getTaskTypes = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/dictionary/task/types',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'taskTypes'), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getProjectTypes = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/dictionary/project/types',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'projectTypes'), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getMilestoneTypes = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/dictionary/milestone/types',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'milestoneTypes'), true)(
        dispatch
      ),
      error: defaultErrorHandler(dispatch)
    });
};

export const getDepartments = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/dictionary/departments',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'departments'), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getTestCaseStatuses = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case/statuses',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'testCaseStatuses'), true)(
        dispatch
      ),
      error: defaultErrorHandler(dispatch)
    });
};

export const getTestCaseSeverities = () => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-case/severities',
      method: GET,
      body,
      extra,
      start: withStartLoading(startDictionaryRequest, true)(dispatch),
      response: withFinishLoading(response => successDictionaryRequest(response.data, 'testCaseSeverities'), true)(
        dispatch
      ),
      error: defaultErrorHandler(dispatch)
    });
};
