import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import auth from './auth';
import {reducer as form} from 'redux-form';
import tasks from './tasks';
import currentTask from './current_task';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  tasks,
  currentTask
});
