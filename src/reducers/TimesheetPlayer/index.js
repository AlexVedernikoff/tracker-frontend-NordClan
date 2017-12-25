import moment from 'moment';
import reducerFabric from './fabric';
import {
  TIMESHEET_PLAYER_RECEIVE_START,
  TIMESHEET_PLAYER_RECEIVE_SUCCESS,
  TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS,
  TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS,
  GET_ACTIVE_TASK
} from '../../constants/TimesheetPlayer';

import {
  CREATE_TIMESHEET_SUCCESS,
  UPDATE_TIMESHEET_SUCCESS,
  DELETE_TIMESHEET_SUCCESS
} from '../../constants/Timesheets';

import {
  TASK_CHANGE_REQUEST_SUCCESS
} from '../../constants/Task';

const InitialState = {
  activityTabs: [],
  activeTask: null,
  availableProjects: [],
  tracks: {}
};

exports[TIMESHEET_PLAYER_RECEIVE_START] = (state = InitialState, action) => {
  return {
    ...state,
    isReceiving: true
  };
}

exports[TIMESHEET_PLAYER_RECEIVE_SUCCESS] = (state = InitialState, action) => {
  const availableProjects = action.data.availableProjects;
  delete action.data.availableProjects;
  const updatedTracks = setDefaultSpentTime(action)
  return {
    ...state,
    availableProjects: availableProjects,
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

exports[UPDATE_TIMESHEET_SUCCESS] = (state = InitialState, action) => {
  return onUpdateTracks(state, action);
}

function onUpdateTracks(state, action) {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');

  const needUpdatePlayer = action.timesheet.onDate in state.tracks;
  if (!needUpdatePlayer) {
    return state;
  }

  const updatedTracks = state.tracks[action.timesheet.onDate].tracks
    .map((track) => {
      const taskId = getTaskId(action);
      const isDraft = taskId && track.taskId === taskId && action.timesheet.isDraft;
      return track.id === action.timesheet.id || isDraft
        ? { ...track, ...action.timesheet }
        : track;
    });

  const newState = updateTracks(state, action, updatedTracks);
  return newState;
}

exports[CREATE_TIMESHEET_SUCCESS] = (state = InititalState, action) => {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
  action.timesheet.spentTime = action.timesheet.spentTime || 0

  const needCreateTimesheetInPlayer = action.timesheet.onDate in state.tracks;
  if (!needCreateTimesheetInPlayer) {
    return state;
  }

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
    && track.taskStatusId === action.timesheet.taskStatusId
    && track.isDraft;
}

function getTaskId(action) {
  return action.timesheet.task ? action.timesheet.task.id : action.timesheet.taskId;
}

exports[DELETE_TIMESHEET_SUCCESS] = (state = InitialState, action) => {
  action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');

  const needDeleteTimesheetInPlayer = action.timesheet.onDate in state.tracks;
  if (!needDeleteTimesheetInPlayer) {
    return state;
  }

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

exports[GET_ACTIVE_TASK] = (state = InitialState, action) => {
  return {
    ...state,
    activeTask: action.task
  }
}

exports[TASK_CHANGE_REQUEST_SUCCESS] = (state = InitialState, action) => {
  const updatedState = Object.entries(state.tracks)
    .reduce((acc, [day, { tracks, scales }]) => {
      const updatedTracks = tracks.map(track => {
        if (action.changedFields.id && track.taskId === action.changedFields.id) {
          return {
            ...track,
            task: { ...track.task, ...action.changedFields }
          }
        }
        return track;
      })

      acc.tracks[day] = { tracks: updatedTracks, scales }
      return acc;
    }, { ...state })

  return updatedState;
}

module.exports = reducerFabric(module.exports, InitialState);
