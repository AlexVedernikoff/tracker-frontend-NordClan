import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Dictionaries from './Dictionaries';
import Projects from './Projects';
import Loading from './Loading';
import Project from './Project';
import PlanningTasks from './PlanningTasks';
import Tasks from './Tasks';
import Task from './Task';
import TaskList from './TaskList';
import Portfolios from './Portfolios';
import Notifications from './Notifications';
import Portfolio from './Portfolio';
import TimesheetPlayer from './TimesheetPlayer';
import Timesheets from './Timesheets';
import UsersRoles from './UsersRoles';
import ExternalUsers from './ExternalUsers';
import Localize from './Localize';
import Gitlab from './Gitlab';
import UserList from './Users';
import Jira from './Jira';
import TestCase from './TestCase';

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
  TestCase
});

export default rootReducer;
