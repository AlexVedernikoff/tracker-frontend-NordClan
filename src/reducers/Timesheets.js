import * as TimesheetsActions from '../constants/Timesheets';

const InitialState = {
  list: [],
  dateBegin: '',
  dateEnd: ''
};

export default function Portfolios (state = InitialState, action) {
  switch (action.type) {
  case TimesheetsActions.GET_TIMESHEETS_START:
    return {
      ...state
    };

  case TimesheetsActions.GET_TIMESHEETS_SUCCESS:
    return {
      ...state,
      list: action.data
    };

  case TimesheetsActions.SET_WEEK:
    return {
      ...state,
      dateBegin: action.dateBegin,
      dateEnd: action.dateEnd,
      startingDay: action.startingDay
    };

  default:
    return {
      ...state
    };
  }
}
