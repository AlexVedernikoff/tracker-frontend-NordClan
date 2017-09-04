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

    // нужно заменить старые данные новыми

    return {
      ...state,
    };


  default:
    return state;
  }
}

export default TimesheetPlayer;
