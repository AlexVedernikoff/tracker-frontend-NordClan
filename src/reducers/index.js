import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Projects from './Projects';
import Loading from './Loading';
import Project from './Project';

const rootReducer = combineReducers({
  Auth,
  Loading,
  Project,
  Projects,
  routing: routerReducer
});

export default rootReducer;
