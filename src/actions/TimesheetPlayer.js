import * as TimesheetPlayer from '../constants/TimesheetPlayer';
import { API_URL } from '../constants/Settings';
import { GET, POST, PUT, REST_API} from '../constants/RestApi';
import {
  withFinishLoading,
  withStartLoading,
  defaultExtra as extra,
  withdefaultExtra
} from './Common';

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

const playerTimesheetUpdateReceived = (timesheet) => {

  return {
    type: TimesheetPlayer.TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS,
    timesheet
  };
};


export const getTimesheetsPlayerData = (startDate, endDate) => {

  return dispatch => dispatch({
    type: REST_API,
    url: `/timesheet/tracksAll/?startDate=${startDate}&endDate=${endDate}`,
    method: GET,
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(playerDataReceived(response.data));
    })(dispatch),
    error: playerDataReceived(dispatch)
  });
};


export const updateDraftVisible = (data, options) => {

  return dispatch => dispatch({
    type: REST_API,
    url: `/timesheetDraft/${data.timesheetId}`,
    method: PUT,
    body: data.body,
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(playerDataUpdateReceived(response.data, options.itemKey));
    })(dispatch),
    error: playerDataReceiveFailed(dispatch)
  });
};

export const updateTimesheetDraft = (data, options) => {

  return dispatch => dispatch({
    type: REST_API,
    url: `/timesheet/${data.timesheetId}`,
    method: PUT,
    body: {isDraft: true, ...data.body},
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(playerDataUpdateReceived(response.data, options.itemKey));
    })(dispatch),
    error: playerDataReceiveFailed(dispatch)
  });
};

export const updateExistedTimesheet = (data, options) => {

  return dispatch => dispatch({
    type: REST_API,
    url: `/timesheet/${data.timesheetId}`,
    method: PUT,
    body: {isDraft: false, ...data.body},
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(playerDataUpdateReceived(response.data, options.itemKey));
    })(dispatch),
    error: playerDataReceiveFailed(dispatch)
  });
};

export const updateTimesheet = (data, options) => {

  if (options.isDraft === true) {
    if ('isVisible' in data.body) {
      return updateDraftVisible(data, options); // Скрываю драфт
    }
    return updateTimesheetDraft(data, options); // Делаю из драфта тш
  }

  return updateExistedTimesheet(data, options);
};

////////////////////////////////
export const updateDraft = (data, options) => {
  return dispatch => dispatch({
    type: REST_API,
    url: `/draftsheet/?return=${data.return}`,
    method: PUT,
    body: { ...data },
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(playerDataUpdateReceived(response.data, options.onDate));
    })(dispatch),
    error: playerDataReceiveFailed(dispatch)
  });
};

export const updateOnlyTimesheet = (data) => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/timesheet/',
    method: PUT,
    body: { ...data },
    extra,
    start: withStartLoading(startReceivePlayerData, true)(dispatch),
    response: withFinishLoading(response => {
      console.log(response);
      dispatch(playerTimesheetUpdateReceived(response.data));
    })(dispatch),
    error: playerDataReceiveFailed(dispatch)
  });
};
