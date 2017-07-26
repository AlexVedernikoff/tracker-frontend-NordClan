import React, { Component } from 'react';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  IndexRedirect,
  Redirect
} from 'react-router';
import { API_URL } from './constants/Settings';

import MainContainer from './pages/MainContainer';
import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import Comments from './pages/TaskPage/Comments';
import TaskHistory from './pages/TaskPage/TaskHistory';
import ProjectPage from './pages/ProjectPage';
import AgileBoard from './pages/ProjectPage/AgileBoard';
import Info from './pages/ProjectPage/Info';
import Settings from './pages/ProjectPage/Settings';
import Planning from './pages/ProjectPage/Planning';
import Analitics from './pages/ProjectPage/Analitics';
import TaskList from './pages/ProjectPage/TaskList';
import MyTasks from './pages/MyTasks';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Repeat from './pages/Repeat';
import DemoPage from './components/Icons/DemoPage';

import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import axios from 'axios';

export const store = configureStore();
export const history = syncHistoryWithStore(browserHistory, store);

// Auth check for Auth-required pages
const requireAuth = function (nextState, replace, cb) {
  axios.get(`${API_URL}/user/me`, {}, { withCredentials: true })
  .catch(err => {
    replace('login');
    cb();
  })
  .then(response => cb());
};

// Auth check for login page
const isLogged = function (nextState, replace, cb) {
  axios
    .get(`${API_URL}/user/me`, {}, { withCredentials: true })
    .then(response => {
      if (response.status === 200) replace('projects');
      cb();
    })
    .catch(error => cb());
};

export default class AppRouter extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router key={Math.random()} history={history}>
          <Route path="/" component={MainContainer}>
            <Route path="login" component={Login} onEnter={isLogged} />
            <Route path="icons" component={DemoPage} />

            <Route path="/" component={InnerContainer} onEnter={requireAuth}>
              <Route path="dashboard" component={Dashboard} />
              <Route path="repeat" component={Repeat} />
              <Route path="tasks" component={MyTasks} />
              <Route path="projects" component={Projects} />

              <Route path="projects/:projectId" component={ProjectPage}>
                <Route path="agile-board" component={AgileBoard} />
                <Route path="info" component={Info} />
                <Route path="property" component={Settings} />
                <Route path="planning" component={Planning} />
                <Route path="analitics" component={Analitics} />
                <Route path="tasks" component={TaskList} />
                <IndexRedirect to="agile-board" />
              </Route>

              <Route
                path="projects/:projectId/tasks/:taskId"
                component={TaskPage}
              >
                <Route path="comments" component={Comments} />
                <Route path="history" component={TaskHistory} />
                <IndexRedirect to="comments" />
              </Route>

              <IndexRedirect to="projects" />
            </Route>

            <IndexRedirect to="login" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
