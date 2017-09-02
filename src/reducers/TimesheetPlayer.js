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
    const array = state.tracks[action.tracks.onDate];
    array.visible[action.tracks.itemKey] = action.tracks.data;

    return {
      ...state,
      tracks: {
        [action.tracks.onDate.slice(0, 10)]: array,
        ...state.tracks,
      },
    };


  default:
    return state;
  }
}

export default TimesheetPlayer;
