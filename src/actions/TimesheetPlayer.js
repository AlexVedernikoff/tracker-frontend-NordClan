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

const playerDataUpdateReceived = (data, itemKey) => ({
  type: TimesheetPlayer.TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS,
  data,
  itemKey
});

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
    method: POST,
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
