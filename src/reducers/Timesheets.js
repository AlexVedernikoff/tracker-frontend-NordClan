import * as TimesheetsActions from '../constants/Timesheets';
import { findTimesheet } from '../utils/Timesheets';
import moment from 'moment';
import get from 'lodash/get';

moment.locale('ru');

const InitialState = {
  projects: [],
  preloaders: {
    creating: false,
    gettingTimesheets: false
  },
  list: [],
  startingDay: moment(),
  dateBegin: moment()
    .weekday(0)
    .format('YYYY-MM-DD'),
  dateEnd: moment()
    .weekday(6)
    .format('YYYY-MM-DD'),
  selectedActivityType: null,
  selectedTask: null,
  selectedTaskStatusId: null,
  selectedProject: null,
  selectedActivityTypeId: null,
  filteredTasks: [],
  tempTimesheets: []
};

export default function Timesheets(state = InitialState, action) {
  switch (action.type) {
    case TimesheetsActions.DELETE_TIMESHEET_SUCCESS:
      const updatedList = state.list.filter(timesheet => {
        return timesheet.id !== action.timesheet.id;
      });

      return {
        ...state,
        list: updatedList
      };
    case TimesheetsActions.CREATE_TIMESHEET_START:
      return {
        ...state,
        preloaders: {
          ...state.preloaders,
          creating: true
        }
      };
    case TimesheetsActions.CREATE_TIMESHEET_SUCCESS:
      if (get(action, 'timesheet.isDraft')) {
        return state;
      }

      const tempTsh = findTimesheet(state.tempTimesheets, action.timesheet);
      const newTempTimesheets = tempTsh
        ? state.tempTimesheets.filter(tsh => tsh.id !== tempTsh.id)
        : state.tempTimesheets;

      return {
        ...state,
        list: [...state.list, action.timesheet],
        tempTimesheets: [...newTempTimesheets],
        preloaders: {
          ...state.preloaders,
          creating: false
        }
      };
    case TimesheetsActions.CREATE_TIMESHEET_ERROR:
      return {
        ...state,
        preloaders: {
          ...state.preloaders,
          creating: false
        }
      };
    case TimesheetsActions.UPDATE_TIMESHEET_SUCCESS:
      const updatedTimesheets = state.list.map(sheet => {
        return sheet.id === action.timesheet.id ? { ...sheet, ...action.timesheet } : sheet;
      });

      return {
        ...state,
        list: updatedTimesheets
      };

    case TimesheetsActions.GET_TIMESHEETS_START:
      return {
        ...state,
        preloaders: {
          ...state.preloaders,
          gettingTimesheets: true
        }
      };

    case TimesheetsActions.GET_TIMESHEETS_SUCCESS:
      return {
        ...state,
        list: action.data,
        preloaders: {
          ...state.preloaders,
          gettingTimesheets: false
        }
      };

    case TimesheetsActions.GET_TIMESHEETS_ERROR:
      return {
        ...state,
        preloaders: {
          ...state.preloaders,
          gettingTimesheets: false
        }
      };

    case TimesheetsActions.SET_WEEK:
      return {
        ...state,
        startingDay: action.startingDay,
        dateBegin: moment(action.startingDay)
          .weekday(0)
          .format('YYYY-MM-DD'),
        dateEnd: moment(action.startingDay)
          .weekday(6)
          .format('YYYY-MM-DD')
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

    case TimesheetsActions.FILTER_PROJECTS:
      return {
        ...state,
        projects: action.projects
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
        tempTimesheets: state.tempTimesheets.filter(el => !~action.ids.indexOf(el.id))
      };

    case TimesheetsActions.EDIT_TEMP_TIMESHEET:
      return {
        ...state,
        tempTimesheets: state.tempTimesheets.map(el => {
          if (el.id === action.id) {
            return {
              ...el,
              ...action.updatedFields
            };
          } else {
            return el;
          }
        })
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
      return state;
  }
}
