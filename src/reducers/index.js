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
import Portfolios from './Portfolios';
import Notifications from './Notifications';
import Portfolio from './Portfolio';
import TimesheetPlayer from './TimesheetPlayer';

const rootReducer = combineReducers({
  Auth,
  Loading,
  Notifications,
  PlanningTasks,
  Portfolios,
  Project,
  Projects,
  Tasks,
  Task,
  Portfolio,
  TimesheetPlayer,
  Dictionaries,
  routing: routerReducer
});

export default rootReducer;
