import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import Auth from './Authentication';
import Dictionaries from './Dictionaries';
import ExternalUsers from './ExternalUsers';
import Gitlab from './Gitlab';
import Jira from './Jira';
import Loading from './Loading';
import Localize from './Localize';
import Notifications from './Notifications';
import PlanningTasks from './PlanningTasks';
import Portfolio from './Portfolio';
import Portfolios from './Portfolios';
import Project from './Project';
import Projects from './Projects';
import Task from './Task';
import TaskList from './TaskList';
import Tasks from './Tasks';
import TestingCaseReference from './TestingCaseReference';
import TimesheetPlayer from './TimesheetPlayer';
import Timesheets from './Timesheets';
import UserList from './Users';
import UsersRoles from './UsersRoles';

const rootReducer = combineReducers({
  Auth,
  Loading,
  Notifications,
  PlanningTasks,
  Portfolios,
  Project,
  Projects,
  Tasks,
  TaskList,
  Task,
  Portfolio,
  Timesheets,
  TimesheetPlayer,
  Dictionaries,
  UsersRoles,
  UserList,
  ExternalUsers,
  Localize,
  Gitlab,
  Jira,
  routing: routerReducer,
  TestingCaseReference
});

export default rootReducer;
