import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Projects from './Projects';
import UserInfo from './UserInfo';

const rootReducer = combineReducers({ Auth, Projects, UserInfo, routing: routerReducer });

export default rootReducer;
