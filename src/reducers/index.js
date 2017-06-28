import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Projects from "./Projects";

const rootReducer = combineReducers({ Auth, Projects, routing: routerReducer });

export default rootReducer;
