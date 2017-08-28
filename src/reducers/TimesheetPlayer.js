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
        '2017-08-28': action.tracks,
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
