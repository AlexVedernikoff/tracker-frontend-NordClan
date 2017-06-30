import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Auth from './Authentication';
import Projects from './Projects';
import UserInfo from './UserInfo';
import Loading from './Loading';
import ProjectInfo from './ProjectInfo';

const rootReducer = combineReducers({ Auth, Loading, ProjectInfo, Projects, UserInfo, routing: routerReducer });

export default rootReducer;
