import * as TimesheetsActions from '../constants/Timesheets';
import { GET, POST, PUT, REST_API} from '../constants/RestApi';

import {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  defaultBody as body,
  defaultExtra as extra,
  withdefaultExtra
} from './Common';

const startTimesheetsRequest = () => ({
  type: TimesheetsActions.GET_TIMESHEETS_START
});

const successTimesheetsRequest = (data) => ({
  type: TimesheetsActions.GET_TIMESHEETS_SUCCESS,
  data
});

export const getTimesheets = (params) => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/task/timesheet/getTimesheets',
    method: GET,
    body: { params },
    extra,
    start: withStartLoading(startTimesheetsRequest, true)(dispatch),
    response: withFinishLoading(response => successTimesheetsRequest(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

export const changeWeek = (dateBegin, dateEnd, startingDay) => ({
  type: TimesheetsActions.SET_WEEK,
  dateBegin,
  dateEnd,
  startingDay
});
