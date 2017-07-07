import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Projects from './Projects';
import Loading from './Loading';
import Project from './Project';
import Task from './Task';
import Notifications from './Notifications';

const rootReducer = combineReducers({
  Auth,
  Loading,
  Notifications,
  Project,
  Projects,
  Task,
  routing: routerReducer
});

export default rootReducer;
