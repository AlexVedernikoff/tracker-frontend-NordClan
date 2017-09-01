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
        [action.tracks.onDate.slice(0,10)]: action.tracks.data,
      },
    };

  case TimesheetPlayersActions.TIMESHEET_PLAYER_RECEIVE_FAIL:
    return {
      ...state
    };

  default:
    return state;
  }
}

export default TimesheetPlayer;
