import * as TimesheetsActions from '../constants/Timesheets';
import { GET, POST, PUT, REST_API} from '../constants/RestApi';
import moment from 'moment';

import axios from 'axios';
import { API_URL } from '../constants/Settings';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

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
    url: '/timesheet',
    method: GET,
    body: { params },
    extra,
    start: withStartLoading(startTimesheetsRequest, true)(dispatch),
    response: withFinishLoading(response => successTimesheetsRequest(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

const startCreateTimesheetRequest = () => ({
  type: TimesheetsActions.CREATE_TIMESHEET_START
});

const successCreateTimesheetRequest = (data) => ({
  type: TimesheetsActions.CREATE_TIMESHEET_SUCCESS,
  data
});

const startUpdateTimesheetRequest = () => ({
  type: TimesheetsActions.CREATE_TIMESHEET_START
});

const successUpdateTimesheetRequest = () => ({
  type: TimesheetsActions.CREATE_TIMESHEET_SUCCESS
});

// export const createTimesheet = (params) => {
//   return dispatch => dispatch({
//     type: REST_API,
//     url: '/timesheet',
//     method: POST,
//     body: { params },
//     extra,
//     start: withStartLoading(startCreateTimesheetRequest, true)(dispatch),
//     response: withFinishLoading(response => successCreateTimesheetRequest(response.data), true)(dispatch),
//     error: defaultErrorHandler(dispatch)
//   });
// };

export const updateTimesheet = (data, userId, startingDay) => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/timesheet',
    method: PUT,
    body: { ...data },
    extra,
    start: withStartLoading(startUpdateTimesheetRequest, true)(dispatch),
    response: () => {
      dispatch(getTimesheets({
        userId,
        dateBegin: moment(startingDay).day(1).format('YYYY-MM-DD'),
        dateEnd: moment(startingDay).day(7).format('YYYY-MM-DD')
      }));
      dispatch(successUpdateTimesheetRequest());
      dispatch(finishLoading());
    },
    error: defaultErrorHandler(dispatch)
  });
};

export const createTimesheet = (params, userId, startingDay) => { // TODO: не смог разобраться, как лучше послать query-params, используя мидлварь для rest API, поэтому экшн создан напрямую с axios
  const URL = `${API_URL}/timesheet`;
  return dispatch => {
    dispatch(startCreateTimesheetRequest());
    dispatch(startLoading());
    axios
      .post(URL, params)
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successCreateTimesheetRequest(response.data));
          dispatch(finishLoading());
          dispatch(getTimesheets({
            userId,
            dateBegin: moment(startingDay).day(1).format('YYYY-MM-DD'),
            dateEnd: moment(startingDay).day(7).format('YYYY-MM-DD')
          }));
        }
      });
  };
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
