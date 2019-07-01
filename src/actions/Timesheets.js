import * as TimesheetsActions from '../constants/Timesheets';
import { GET, POST, PUT, DELETE, REST_API } from '../constants/RestApi';
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
  defaultExtra as extra
} from './Common';

export const clearTimeSheetsState = () => ({
  type: TimesheetsActions.CLEAR_TIMESHEETS_STATE
});

const startTimesheetsRequest = () => ({
  type: TimesheetsActions.GET_TIMESHEETS_START
});

const successTimesheetsRequest = data => ({
  type: TimesheetsActions.GET_TIMESHEETS_SUCCESS,
  data
});

const startCompanyTimesheetsRequest = () => ({
  type: TimesheetsActions.GET_COMPANY_TIMESHEETS_START
});

const successCompanyTimesheetsRequest = data => ({
  type: TimesheetsActions.GET_COMPANY_TIMESHEETS_SUCCESS,
  data
});

const startCreateTimesheetRequest = () => ({
  type: TimesheetsActions.CREATE_TIMESHEET_START
});

const failCreateTimesheetRequest = () => {
  return {
    type: TimesheetsActions.CREATE_TIMESHEET_ERROR
  };
};

const startUpdateTimesheetRequest = () => ({
  type: TimesheetsActions.UPDATE_TIMESHEET_START
});

const successUpdateTimesheetRequest = timesheet => ({
  type: TimesheetsActions.UPDATE_TIMESHEET_SUCCESS,
  timesheet
});

const startDeleteTimesheetRequest = () => ({
  type: TimesheetsActions.DELETE_TIMESHEET_START
});

export const getTimesheets = params => {
  return dispatch =>
    dispatch({
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

export const getCompanyTimesheets = params => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/company-timesheets',
      method: GET,
      body: { params },
      extra,
      start: withStartLoading(startCompanyTimesheetsRequest, true)(dispatch),
      response: withFinishLoading(response => successCompanyTimesheetsRequest(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const getProjectTimesheets = (projectId, params) => {
  const url = `/project/${projectId}/timesheet`;
  return dispatch =>
    dispatch({
      type: REST_API,
      url: url,
      method: GET,
      body: { params },
      extra,
      start: withStartLoading(startTimesheetsRequest, true)(dispatch),
      response: withFinishLoading(response => successTimesheetsRequest(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const updateTimesheet = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/timesheet',
        method: PUT,
        body: { ...data },
        extra,
        start: withStartLoading(startUpdateTimesheetRequest, true)(dispatch),
        response: response => {
          dispatch(finishLoading());
          resolve(response);
        },
        error: error => {
          defaultErrorHandler(dispatch);
          reject(error);
        }
      });
    });
  };
};

export const deleteTimesheets = ids => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: `/timesheet/${ids}`,
      method: DELETE,
      body,
      extra,
      start: withStartLoading(startDeleteTimesheetRequest, true)(dispatch),
      response: () => dispatch(finishLoading()),
      error: defaultErrorHandler(dispatch)
    });
};

export const deleteTempTimesheets = ids => ({
  type: TimesheetsActions.DELETE_TEMP_TIMESHEET,
  ids
});

export const editTempTimesheet = (id, updatedFields) => ({
  type: TimesheetsActions.EDIT_TEMP_TIMESHEET,
  id,
  updatedFields
});

export const createTimesheet = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: REST_API,
        url: '/timesheet',
        method: POST,
        body: { ...data },
        extra,
        start: withStartLoading(startCreateTimesheetRequest, true)(dispatch),
        response: response => {
          dispatch(finishLoading());
          resolve(response);
        },
        error: error => {
          withFinishLoading(failCreateTimesheetRequest, true)(dispatch)(error);
          dispatch(showNotification({ message: error.response.data.message, type: 'error' }));
          reject(error);
        }
      });
    });
  };
};

export const updateSheetsArray = (sheetsArr, userId, startingDay) => {
  const URL = `${API_URL}/timesheet`;
  return dispatch => {
    dispatch(startUpdateTimesheetRequest());
    dispatch(startLoading());

    const currentPromise = function(params) {
      return axios.put(URL, params).catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
      });
    };

    const allPromises = sheetsArr.map(element => currentPromise(element));

    Promise.all(allPromises).then(response => {
      let isOk = false;

      isOk = response.every(() => {
        if (response.status === 200) {
          return true;
        } else {
          dispatch(finishLoading());
          return false;
        }
      });

      if (isOk) {
        dispatch(successUpdateTimesheetRequest());
        dispatch(finishLoading());
        dispatch(
          getTimesheets({
            userId,
            dateBegin: moment(startingDay)
              .weekday(0)
              .format('YYYY-MM-DD'),
            dateEnd: moment(startingDay)
              .weekday(6)
              .format('YYYY-MM-DD')
          })
        );
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
    dispatch(
      getTimesheets({
        userId,
        dateBegin: moment(startingDay)
          .weekday(0)
          .format('YYYY-MM-DD'),
        dateEnd: moment(startingDay)
          .weekday(6)
          .format('YYYY-MM-DD')
      })
    );
  };
};

export const changeProjectWeek = (startingDay, projectId) => {
  return dispatch => {
    dispatch({
      type: TimesheetsActions.SET_WEEK,
      startingDay
    });
    const params = {
      dateBegin: moment(startingDay)
        .weekday(0)
        .format('YYYY-MM-DD'),
      dateEnd: moment(startingDay)
        .weekday(6)
        .format('YYYY-MM-DD')
    };
    dispatch(projectId !== undefined ? getProjectTimesheets(projectId, params) : getCompanyTimesheets(params));
  };
};

export const changeTask = (task, taskStatusId) => ({
  type: TimesheetsActions.CHANGE_TASK,
  task: Array.isArray(task) ? null : task,
  taskStatusId
});

export const changeActivityType = typeId => ({
  type: TimesheetsActions.CHANGE_ACTIVITY_TYPE,
  typeId
});

export const changeProject = project => ({
  type: TimesheetsActions.CHANGE_PROJECT,
  project: Array.isArray(project) ? null : project
});

export const clearModalState = () => ({
  type: TimesheetsActions.CLEAR_MODAL_STATE
});

export const addActivity = item => ({
  item,
  type: TimesheetsActions.ADD_ACTIVITY
});

export const filterTasks = tasks => ({
  type: TimesheetsActions.FILTER_TASKS,
  tasks
});

export const filterProjects = projects => ({
  type: TimesheetsActions.FILTER_PROJECTS,
  projects
});

// Поиск по задачам
export const getTasksForSelect = (name = '', projectId, sprintId) => {
  return dispatch => {
    return axios
      .get(
        `${API_URL}/task`,
        {
          params: {
            name,
            ...{ projectId, sprintId },
            fields:
              'factExecutionTime,plannedExecutionTime,id,name,prioritiesId,projectId,sprintId,statusId,typeId,prefix'
          }
        },
        { withCredentials: true }
      )
      .then(response => response.data.data)
      .then(tasks => {
        dispatch(filterTasks(tasks));
        return {
          options: tasks.map(task => ({
            label: `${task.prefix}-${task.id}: ${task.name}`,
            value: task.id,
            body: task
          }))
        };
      });
  };
};

// Поиск по проектам
export const getProjectsForSelect = (name = '', hideEmptyValue) => {
  return dispatch => {
    return axios
      .get(
        `${API_URL}/project`,
        { params: { name, userIsParticipant: true, onlyUserInProject: true } },
        { withCredentials: true }
      )
      .then(response => response.data.data)
      .then(projects => {
        const options = projects.map(project => ({
          label: project.name,
          value: project.id,
          body: project
        }));
        dispatch(filterProjects(options));
        return {
          options: hideEmptyValue
            ? options
            : options.concat({
                label: 'Без проекта',
                value: 0,
                body: null
              })
        };
      });
  };
};
