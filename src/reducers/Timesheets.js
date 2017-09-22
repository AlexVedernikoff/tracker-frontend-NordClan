import * as TimesheetsActions from '../constants/Timesheets';
import moment from 'moment';

const InitialState = {
  list: [],
  startingDay: moment(),
  dateBegin: moment().day(1).format('YYYY-MM-DD'),
  dateEnd: moment().day(7).format('YYYY-MM-DD')
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
      startingDay: action.startingDay,
      dateBegin: moment(action.startingDay).day(1).format('YYYY-MM-DD'),
      dateEnd: moment(action.startingDay).day(7).format('YYYY-MM-DD')
    };

  default:
    return {
      ...state
    };
  }
}
