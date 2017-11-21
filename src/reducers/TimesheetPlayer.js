import * as TimesheetPlayersActions from '../constants/TimesheetPlayer';


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
    const updatedList = state.tracks[action.timesheet.onDate].tracks.map((track) => track.id === action.timesheet.id ? action.timesheet : track);
    state.tracks[action.timesheet.onDate] = updatedList;

    return {
      ...state
    };

  default:
    return state;
  }
}

export default TimesheetPlayer;
