import * as TimesheetsActions from '../constants/Timesheets';
import moment from 'moment';
import _ from 'lodash';

moment.locale('ru');

const InitialState = {
  list: [],
  startingDay: moment(),
  dateBegin: moment().weekday(0).format('YYYY-MM-DD'),
  dateEnd: moment().weekday(6).format('YYYY-MM-DD'),
  selectedActivityType: null,
  selectedTask: null,
  selectedTaskStatusId: null,
  selectedProject: null,
  selectedActivityTypeId: null,
  filteredTasks: [],
  tempTimesheets: []
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
      dateBegin: moment(action.startingDay).weekday(0).format('YYYY-MM-DD'),
      dateEnd: moment(action.startingDay).weekday(6).format('YYYY-MM-DD')
    };

  case TimesheetsActions.CHANGE_ACTIVITY_TYPE:
    return {
      ...state,
      selectedActivityType: action.typeId
    };

  case TimesheetsActions.CHANGE_TASK:
    return {
      ...state,
      selectedTask: action.task,
      selectedTaskStatusId: action.taskStatusId
    };

  case TimesheetsActions.CHANGE_PROJECT:
    return {
      ...state,
      selectedProject: action.project
    };

  case TimesheetsActions.FILTER_TASKS:
    return {
      ...state,
      filteredTasks: action.tasks
    };

  case TimesheetsActions.ADD_ACTIVITY:
    return {
      ...state,
      tempTimesheets: state.tempTimesheets.concat(action.item)
    };

  case TimesheetsActions.DELETE_TEMP_TIMESHEET:
    return {
      ...state,
      tempTimesheets: state.tempTimesheets.filter((el) => !~action.ids.indexOf(el.id))
    };

  case TimesheetsActions.CLEAR_MODAL_STATE:
    return {
      ...state,
      selectedActivityType: null,
      selectedTask: null,
      selectedTaskStatusId: null,
      selectedProject: null,
      selectedActivityTypeId: null
    };

  default:
    return {
      ...state
    };
  }
}
