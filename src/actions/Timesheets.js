import * as TimesheetsActions from '../constants/Timesheets';
import { GET, POST, PUT, REST_API} from '../constants/RestApi';
import moment from 'moment';

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

export const changeWeek = (startingDay, userId) => {
  return dispatch => {
    dispatch({
      type: TimesheetsActions.SET_WEEK,
      startingDay
    });
    dispatch(getTimesheets({
      userId,
      dateBegin: moment(startingDay).day(1).format('YYYY-MM-DD'),
      dateEnd: moment(startingDay).day(7).format('YYYY-MM-DD')
    }));
  };
};

export const changeTask = (task, taskStatusId) => ({
  type: TimesheetsActions.CHANGE_TASK,
  task: Array.isArray(task) ? null : task,
  taskStatusId
});

export const changeActivityType = (typeId) => ({
  type: TimesheetsActions.CHANGE_ACTIVITY_TYPE,
  typeId
});

export const changeProject = (project) => ({
  type: TimesheetsActions.CHANGE_PROJECT,
  project: Array.isArray(project) ? null : project
});

export const clearModalState = () => ({
  type: TimesheetsActions.CLEAR_MODAL_STATE
});

export const addActivity = () => ({
  type: TimesheetsActions.ADD_ACTIVITY
});

export const filterTasks = (tasks) => ({
  type: TimesheetsActions.FILTER_TASKS,
  tasks
});
