import moment from 'moment';
import reducerFabric from './fabric';
import {
  TIMESHEET_PLAYER_RECEIVE_START,
  TIMESHEET_PLAYER_RECEIVE_SUCCESS,
  TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS,
  TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS,
} from '../../constants/TimesheetPlayer';

import {
  CREATE_TIMESHEET_SUCCESS,
  UPDATE_TIMESHEET_SUCCESS,
  DELETE_TIMESHEET_SUCCESS
} from '../../constants/Timesheets';


const InitialState = {
  tracks: {}
};

exports[TIMESHEET_PLAYER_RECEIVE_START] = (state = InitialState, action) => {
  return {
    ...state,
    isReceiving: true
  };
}

exports[TIMESHEET_PLAYER_RECEIVE_SUCCESS] = (state = InitialState, action) => {
  const updatedTracks = setDefaultSpentTime(action)
  return {
    ...state,
    tracks: updatedTracks
  };
}

function setDefaultSpentTime(action) {
  return Object.entries(action.data).reduce((acc, [date, tracks]) => {
    const updatedTracks = tracks.tracks.map(track => ({ ...track, spentTime: track.spentTime || 0 }))
    acc[date] = {
      scales: tracks.scales,
      tracks: updatedTracks
    }
    return acc
  }, {})
}

exports[TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS] = (state = InitialState, action) => {
  return {
    ...state,
    tracks: [ ...state.tracks, action.data[action.date] ]
  };
}

exports[TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS] = (state = InitialState, action) => {
  return onUpdateTracks(state, action);
}

exports[UPDATE_TIMESHEET_SUCCESS] = (state = InitialState, action) => {
  return onUpdateTracks(state, action);
}

function onUpdateTracks(state, action) {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
  const updatedTracks = state.tracks[action.timesheet.onDate].tracks
    .map((track) => {
      return track.id === action.timesheet.id || track.taskId === action.timesheet.taskId
        ? { ...track, ...action.timesheet } : track;
    });

  const newState = updateTracks(state, action, updatedTracks);
  return newState;
}

exports[CREATE_TIMESHEET_SUCCESS] = (state = InititalState, action) => {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
  action.timesheet.spentTime = action.timesheet.spentTime || 0

  const updatedTracks = [
    ...state.tracks[action.timesheet.onDate].tracks,
    action.timesheet
  ].filter(track => {
    return !isDeletedDraft(track, action);
  });

  const newState = updateTracks(state, action, updatedTracks);
  return newState;
}

function isDeletedDraft(track, action) {
  return track.id !== action.timesheet.id
    && track.taskId === getTaskId(action)
    && track.isDraft;
}

function getTaskId(action) {
  return action.timesheet.task ? action.timesheet.task.id : action.timesheet.taskId;
}

exports[DELETE_TIMESHEET_SUCCESS] = (state = InitialState, action) => {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
  const updatedTracks = state.tracks[action.timesheet.onDate].tracks
    .filter((track) => {
      return track.id !== action.timesheet.id;
    });

  const newState = updateTracks(state, action, updatedTracks);
  return newState;
}

function updateTracks(state, action, updatedTracks) {
  const updatedDay = {
    [action.timesheet.onDate]: {
      ...state.tracks[action.timesheet.onDate],
      tracks: updatedTracks
    }
  };

  const updatedActivityTime = updatedDay[action.timesheet.onDate].tracks
    .filter(track => track.typeId === action.timesheet.typeId)
    .reduce((acc, time) => acc + parseFloat(time.spentTime), 0).toString();

  const all = updatedDay[action.timesheet.onDate].tracks
    .reduce((acc, time) => acc + parseFloat(time.spentTime), 0).toString();

  updatedDay[action.timesheet.onDate].scales[action.timesheet.typeId] = updatedActivityTime;
  updatedDay[action.timesheet.onDate].scales.all = all;

  return {
    ...state,
    tracks: { ...state.tracks, ...updatedDay }
  };
}

module.exports = reducerFabric(module.exports, InitialState);
