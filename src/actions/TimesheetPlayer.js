import * as TimesheetPlayer from '../constants/TimesheetPlayer';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

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
  const URL = `${API_URL}/timesheet/tracksAll/?startDate=${startDate}&endDate=${endDate}`;

  return dispatch => {
    dispatch(startReceivePlayerData());
    dispatch(startLoading());
    return axios
      .get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(playerDataReceiveFailed());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(playerDataReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};


export const updateDraftVisible = (data, options) => {
  const URL = `${API_URL}/timesheetDraft/${data.timesheetId}`;

  return dispatch => {
    dispatch(startReceivePlayerData());
    dispatch(startLoading());
    return axios
      .put(URL, data.body, { withCredentials: true })
      .catch(error => {
        dispatch(playerDataReceiveFailed());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(playerDataUpdateReceived(response.data, options.onDate, options.itemKey));
          dispatch(finishLoading());
        }
      });
  };
};

export const updateTimesheetDraft = (data, options) => {
  const URL = `${API_URL}/timesheet/${data.timesheetId}`;
  console.log(options);

  return dispatch => {
    dispatch(startReceivePlayerData());
    dispatch(startLoading());
    return axios
      .post(URL, {isDraft: true, ...data.body}, { withCredentials: true })
      .catch(error => {
        dispatch(playerDataReceiveFailed());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(playerDataUpdateReceived(response.data, options.onDate, options.itemKey));
          dispatch(finishLoading());
        }
      });
  };
};


export const updateTimesheet = (data, options) => {
  const URL = `${API_URL}/task/${data.taskId}/timesheet/${data.timesheetId}`;

  /*
  нужен рефакторинг в этой функции
   */

  if (options.isDraft === true) {
    if ('isVisible' in data.body) {
      return updateDraftVisible(data, options);
    }
    return updateTimesheetDraft(data, options);
  }

  return dispatch => {
    dispatch(startReceivePlayerData());
    dispatch(startLoading());
    return axios
      .put(URL, data.body, { withCredentials: true })
      .catch(error => {
        dispatch(playerDataReceiveFailed());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(playerDataUpdateReceived(response.data, options.itemKey));
          dispatch(finishLoading());
        }
      });
  };
};
