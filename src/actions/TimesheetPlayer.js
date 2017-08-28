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
  tracks: data
});

const playerDataReceiveFailed = () => ({
  type: TimesheetPlayer.TIMESHEET_PLAYER_RECEIVE_FAIL
});


export const getTimesheetsPlayerData = (onDate) => {
  const URL = `${API_URL}/timesheet/tracks/?onDate=${onDate}`;


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


export const updateTimesheet = (data) => {
  const URL = `${API_URL}/task/${data.taskId}/timesheet/${data.timesheetId}`;

  console.log(data);


  return dispatch => {
    dispatch(startReceivePlayerData());
    dispatch(startLoading());
    console.log(1);
    return axios
      .put(URL, data.body, { withCredentials: true })
      .catch(error => {
        console.log(error);
        // dispatch(playerDataReceiveFailed());
        // dispatch(showNotification({ message: error.message, type: 'error' }));
        // dispatch(finishLoading());
      })
      .then(response => {
        console.log(response);
        // if (response && response.status === 200) {
        //   console.log(response.data);
        //   //dispatch(playerDataReceived(response.data));
        //   dispatch(finishLoading());
        // }
      });
  };
};
