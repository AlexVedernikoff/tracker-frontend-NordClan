import * as TimesheetPlayer from '../constants/TimesheetPlayer';
import { API_URL } from '../constants/Settings';
import { GET, POST, PUT, REST_API } from '../constants/RestApi';
import { withFinishLoading, withStartLoading, defaultExtra as extra, withdefaultExtra } from './Common';

const startReceivePlayerData = () => ({
  type: TimesheetPlayer.TIMESHEET_PLAYER_RECEIVE_START
});

const playerDataReceived = data => ({
  type: TimesheetPlayer.TIMESHEET_PLAYER_RECEIVE_SUCCESS,
  data
});

const playerDataReceiveFailed = () => ({
  type: TimesheetPlayer.TIMESHEET_PLAYER_RECEIVE_FAIL
});

const playerDataUpdateReceived = (data, date) => {
  return {
    type: TimesheetPlayer.TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS,
    data,
    date
  };
};

const playerTimesheetUpdateReceived = timesheet => {
  return {
    type: TimesheetPlayer.TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS,
    timesheet
  };
};

export const getTimesheetsPlayerData = (startDate, endDate) => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: `/timesheet/tracksAll/?startDate=${startDate}&endDate=${endDate}`,
      method: GET,
      extra,
      start: withStartLoading(startReceivePlayerData, true)(dispatch),
      response: withFinishLoading(response => {
        dispatch(playerDataReceived(response.data));
      })(dispatch),
      error: withFinishLoading(() => {
        dispatch(playerDataReceived(dispatch));
      })(dispatch)
    });
};

export const updateDraft = data => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/draftsheet/',
      method: PUT,
      body: { ...data },
      extra,
      start: withStartLoading(startReceivePlayerData, true)(dispatch),
      response: withFinishLoading(response => {
        dispatch(playerTimesheetUpdateReceived(response.data));
      })(dispatch),
      error: withFinishLoading(() => {
        dispatch(playerDataReceiveFailed(dispatch));
      })(dispatch)
    });
};

export const updateTimesheet = data => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/timesheet/',
      method: PUT,
      body: { ...data },
      extra,
      start: withStartLoading(startReceivePlayerData, true)(dispatch),
      response: withFinishLoading(response => {
        dispatch(playerTimesheetUpdateReceived(response.data));
      })(dispatch),
      error: withFinishLoading(() => {
        dispatch(playerDataReceiveFailed(dispatch));
      })(dispatch)
    });
};

const getActiveTask = task => ({
  type: TimesheetPlayer.GET_ACTIVE_TASK,
  task
});
