import * as TimesheetPlayersActions from '../constants/TimesheetPlayer';
import * as TimesheetsActions from '../constants/Timesheets';
import moment from 'moment';

const InitialState = {
  tracks: {}
};

function TimesheetPlayer (state = InitialState, action) {
  switch (action.type) {
    case TimesheetPlayersActions.TIMESHEET_PLAYER_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case TimesheetPlayersActions.TIMESHEET_PLAYER_RECEIVE_SUCCESS:
      return {
        ...state,
        tracks: {
          ...action.data
        }
      };

    case TimesheetPlayersActions.TIMESHEET_PLAYER_RECEIVE_FAIL:
      return {
        ...state
      };

    case TimesheetPlayersActions.TIMESHEET_PLAYER_UPDATE_RECEIVE_SUCCESS:

      state.tracks[action.date] = action.data[action.date];
      return {
        ...state
      };

    case TimesheetPlayersActions.TIMESHEET_PLAYER_TIMESHEET_UPDATE_RECEIVE_SUCCESS:
    case TimesheetsActions.UPDATE_TIMESHEET_SUCCESS: {
      action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
      const updatedList = state.tracks[action.timesheet.onDate].tracks
        .map((track) => {
          return track.id === action.timesheet.id || track.taskId === action.timesheet.taskId
            ? { ...track, ...action.timesheet } : track;
        });

      const updatedDay = {
        [action.timesheet.onDate]: {
          ...state.tracks[action.timesheet.onDate],
          tracks: updatedList
        }
      };

      const all = updatedDay[action.timesheet.onDate]
        .tracks.reduce((acc, time) => acc + parseFloat(time.spentTime), 0).toString();

      updatedDay[action.timesheet.onDate].scales.all = all

      return {
        ...state,
        tracks: { ...state.tracks, ...updatedDay }
      };
    }

    case TimesheetsActions.CREATE_TIMESHEET_SUCCESS: {
      action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
      const updatedList = [
        ...state.tracks[action.timesheet.onDate].tracks,
        action.timesheet
      ];

      const updatedDay = {
        [action.timesheet.onDate]: {
          ...state.tracks[action.timesheet.onDate],
          tracks: updatedList
        }
      };

      const all = updatedDay[action.timesheet.onDate]
        .tracks.reduce((acc, time) => acc + parseFloat(time.spentTime), 0).toString();

      updatedDay[action.timesheet.onDate].scales.all = all

      return {
        ...state,
        tracks: { ...state.tracks, ...updatedDay }
      };
    }

    case TimesheetsActions.DELETE_TIMESHEET_SUCCESS: {
      action.timesheet.onDate = moment(action.timesheet.onDate).format('YYYY-MM-DD');
      const updatedList = state.tracks[action.timesheet.onDate].tracks
        .filter((track) => {
          return track.id !== action.timesheet.id;
        });

      const updatedDay = {
        [action.timesheet.onDate]: {
          ...state.tracks[action.timesheet.onDate],
          tracks: updatedList
        }
      };

      const all = updatedDay[action.timesheet.onDate]
        .tracks.reduce((acc, time) => acc + parseFloat(time.spentTime), 0).toString();

      updatedDay[action.timesheet.onDate].scales.all = all

      return {
        ...state,
        tracks: { ...state.tracks, ...updatedDay }
      };
    }

    default:
      return state;
  }
}

export default TimesheetPlayer;
