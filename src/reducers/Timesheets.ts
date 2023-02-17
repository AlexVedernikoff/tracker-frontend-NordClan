import moment from 'moment';
import get from 'lodash/get';

import * as TimesheetsActions from '../constants/Timesheets';
import { findTimesheet } from '../utils/Timesheets';
import { initMomentLocale } from '../utils/date';
import { ITimesheetsStore } from '~/store/store.type';

initMomentLocale();

const InitialState: ITimesheetsStore = {
  projects: [] as any[],
  preloaders: {
    creating: false,
    gettingTimesheets: false
  },
  list: [] as any[],
  startingDay: moment(),
  dateBegin: moment()
    .startOf('week')
    .format('YYYY-MM-DD'),
  dateEnd: moment()
    .endOf('week')
    .format('YYYY-MM-DD'),
  selectedActivityType: 1,
  selectedTask: [],
  selectedTaskStatusId: [],
  selectedProject: null,
  selectedActivityTypeId: null,
  filteredTasks: [] as any[],
  tempTimesheets: [] as any[],
  averageNumberOfEmployees: null,
  lastSubmittedTimesheets: []
};

export default function Timesheets(state = InitialState, action): ITimesheetsStore {
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

    case TimesheetsActions.GET_COMPANY_TIMESHEETS_SUCCESS:
    case TimesheetsActions.GET_TIMESHEETS_SUCCESS:
      return {
        ...state,
        list: action.data,
        preloaders: {
          ...state.preloaders,
          gettingTimesheets: false
        }
      };

    case TimesheetsActions.GET_LAST_SUBMITTED_SUCCESS:
      return {
        ...state,
        lastSubmittedTimesheets: action.data
      }

    case TimesheetsActions.GET_AVERAGE_NUMBER_OF_EMPLOYEES_SUCCESS:
      return {
        ...state,
        averageNumberOfEmployees: action.data
      };

    case TimesheetsActions.GET_COMPANY_TIMESHEETS_ERROR:
    case TimesheetsActions.GET_TIMESHEETS_ERROR:
      return {
        ...state,
        preloaders: {
          ...state.preloaders,
          gettingTimesheets: false
        }
      };

    case TimesheetsActions.CLEAR_TIMESHEETS_STATE:
      return {
        ...state,
        list: [],
        tempTimesheets: [],
        startingDay: moment(),
        dateBegin: moment()
          .startOf('week')
          .format('YYYY-MM-DD'),
        dateEnd: moment()
          .endOf('week')
          .format('YYYY-MM-DD')
      };

    case TimesheetsActions.SET_WEEK:
      return {
        ...state,
        startingDay: action.startingDay,
        dateBegin: moment(action.startingDay)
          .startOf('week')
          .format('YYYY-MM-DD'),
        dateEnd: moment(action.startingDay)
          .endOf('week')
          .format('YYYY-MM-DD')
      };

    case TimesheetsActions.CHANGE_ACTIVITY_TYPE:
      return {
        ...state,
        selectedActivityType: action.typeId
      };

    case TimesheetsActions.CHANGE_ARRAY_TASK:
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskStatusId: action.taskStatusId
      };
    case TimesheetsActions.ADD_TASK:
      return {
        ...state,
        selectedTask: [...state.selectedTask, action.task],
        selectedTaskStatusId: [...state.selectedTaskStatusId, action.taskStatusId]
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
        selectedActivityType: 1,
        selectedTask: [],
        selectedTaskStatusId: [],
        selectedProject: null,
        selectedActivityTypeId: null
      };

    default:
      return state;
  }
}
