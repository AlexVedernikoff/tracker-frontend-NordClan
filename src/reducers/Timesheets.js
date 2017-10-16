import * as TimesheetsActions from '../constants/Timesheets';
import moment from 'moment';
import _ from 'lodash';

moment.locale('ru');

const InitialState = {
  list: [],
  startingDay: moment(),
  dateBegin: moment().day(1).format('YYYY-MM-DD'),
  dateEnd: moment().day(7).format('YYYY-MM-DD'),
  selectedActivityType: null,
  selectedTask: null,
  selectedTaskStatusId: null,
  selectedProject: null,
  selectedActivityTypeId: null,
  filteredTasks: []
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
      list: state.list.concat({
        onDate: moment().format('YYYY-MM-DD'),
        typeId: state.selectedActivityType,
        spentTime: '0',
        comment: '',
        taskStatusId: state.selectedTaskStatusId,
        task: state.selectedTask ? {
          id: state.selectedTask.value,
          name: state.selectedTask.label
        } : null,
        project: state.selectedTask ? {
          id: _.find(state.filteredTasks, {id: state.selectedTask.value}).projectId
          // TODO: забирать где-то название проекта. С задачей не приходит.
        } : {
          id: state.selectedProject.value,
          name: state.selectedProject.label
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
    return {
      ...state
    };
  }
}
