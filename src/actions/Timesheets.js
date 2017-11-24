import * as TimesheetsActions from '../constants/Timesheets';
import { GET, POST, PUT, DELETE, REST_API} from '../constants/RestApi';
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
  type: TimesheetsActions.UPDATE_TIMESHEET_START
});

const successUpdateTimesheetRequest = () => ({
  type: TimesheetsActions.UPDATE_TIMESHEET_SUCCESS
});

const startDeleteTimesheetRequest = () => ({
  type: TimesheetsActions.DELETE_TIMESHEET_START
});

const successDeleteTimesheetRequest = () => ({
  type: TimesheetsActions.DELETE_TIMESHEET_SUCCESS
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
        dateBegin: moment(startingDay).weekday(0).format('YYYY-MM-DD'),
        dateEnd: moment(startingDay).weekday(6).format('YYYY-MM-DD')
      }));
      dispatch(successUpdateTimesheetRequest());
      dispatch(finishLoading());
    },
    error: defaultErrorHandler(dispatch)
  });
};

export const deleteTimesheets = (ids, userId, startingDay) => {
  return dispatch => dispatch({
    type: REST_API,
    url: `/timesheet/${ids}`,
    method: DELETE,
    body,
    extra,
    start: withStartLoading(startDeleteTimesheetRequest, true)(dispatch),
    response: () => {
      dispatch(getTimesheets({
        userId,
        dateBegin: moment(startingDay).weekday(0).format('YYYY-MM-DD'),
        dateEnd: moment(startingDay).weekday(6).format('YYYY-MM-DD')
      }));
      dispatch(successDeleteTimesheetRequest());
      dispatch(finishLoading());
    },
    error: defaultErrorHandler(dispatch)
  });
};

export const deleteTempTimesheets = (ids) => ({
  type: TimesheetsActions.DELETE_TEMP_TIMESHEET,
  ids
});

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
            dateBegin: moment(startingDay).weekday(0).format('YYYY-MM-DD'),
            dateEnd: moment(startingDay).weekday(6).format('YYYY-MM-DD')
          }));
        }
      });
  };
};

export const updateSheetsArray = (sheetsArr, userId, startingDay) => {
  const URL = `${API_URL}/timesheet`;
  return dispatch => {
    dispatch(startUpdateTimesheetRequest());
    dispatch(startLoading());

    const currentPromise = function (params) {
      return axios
      .put(URL, params)
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
      });
    };

    const allPromises = sheetsArr.map((element) => currentPromise(element));

    Promise.all(allPromises).then(response => {
      let isOk = false;

      isOk = response.every((element) => {
        if (element.status === 200) {
          return true;
        } else {
          dispatch(finishLoading());
          return false;
        }
      });

      if (isOk) {
        dispatch(successUpdateTimesheetRequest());
        dispatch(finishLoading());
        dispatch(getTimesheets({
          userId,
          dateBegin: moment(startingDay).weekday(0).format('YYYY-MM-DD'),
          dateEnd: moment(startingDay).weekday(6).format('YYYY-MM-DD')
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
      dateBegin: moment(startingDay).weekday(0).format('YYYY-MM-DD'),
      dateEnd: moment(startingDay).weekday(6).format('YYYY-MM-DD')
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

export const addActivity = (item) => ({
  item,
  type: TimesheetsActions.ADD_ACTIVITY
});

export const filterTasks = (tasks) => ({
  type: TimesheetsActions.FILTER_TASKS,
  tasks
});

export const filterProjects = (projects) => ({
  type: TimesheetsActions.FILTER_PROJECTS,
  projects
});

// Поиск по задачам
export const getTasksForSelect = (name = '') => {
  return dispatch => {
    return axios
    .get(
      `${API_URL}/task`,
      { params: {
        name,
        fields: 'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId,prefix'
      } },
      { withCredentials: true }
    )
    .then(response => response.data.data)
    .then(tasks => {
      dispatch(filterTasks(tasks));
      return {
        options: tasks.map((task) => ({
          label: `${task.prefix}-${task.id}: ${task.name}`,
          value: task.id,
          body: task
        }))
      };
    });
  };
};

// Поиск по проектам
export const getProjectsForSelect = (name = '') => {
  return dispatch => {
    return axios
    .get(
      `${API_URL}/project`,
      { params: { name } },
      { withCredentials: true }
    )
    .then(response => response.data.data)
    .then(projects => {
      dispatch(filterProjects(projects));
      return {
        options: projects.map((project) => ({
          label: project.name,
          value: project.id,
          body: project
        })).concat(
          {
            label: 'Без проекта',
            value: 0,
            body: null
          }
        )};
    });
  };
};
