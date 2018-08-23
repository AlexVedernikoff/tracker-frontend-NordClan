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
  ExternalUsers,
  Localize,
  routing: routerReducer
});

export default rootReducer;
