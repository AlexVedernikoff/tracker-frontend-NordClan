import * as DictionariesActions from '../constants/Dictionaries';
import { GET, POST, PUT, REST_API} from '../constants/RestApi';

import {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  defaultBody as body,
  defaultExtra as extra,
  withdefaultExtra
} from './Common';

const startDictionaryRequest = () => ({
  type: DictionariesActions.GET_DICTIONARY_START
});

const successDictionaryRequest = (dictionary, name) => ({
  type: DictionariesActions.GET_DICTIONARY_SUCCESS,
  name: name,
  data: dictionary
});

export const getMagicActivityTypes = () => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/task/timesheet/types/dictionary',
    method: GET,
    body,
    extra,
    start: withStartLoading(startDictionaryRequest, true)(dispatch),
    response: withFinishLoading(response => successDictionaryRequest(response.data, 'magicActivityTypes'), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

export const getTaskStatuses = () => {
  return dispatch => dispatch({
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

