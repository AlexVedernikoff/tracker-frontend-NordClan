import React, { Component } from 'react';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  IndexRedirect,
  Redirect
} from 'react-router';

import MainContainer from './pages/MainContainer';
import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import ProjectPage from './pages/ProjectPage';
import AgileBoard from './pages/ProjectPage/AgileBoard';
import Info from './pages/ProjectPage/Info';
import Property from './pages/ProjectPage/Property';
import Planning from './pages/ProjectPage/Planning';
import Analitics from './pages/ProjectPage/Analitics';
import TaskList from './pages/ProjectPage/TaskList';
import MyTasks from './pages/MyTasks';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Repeat from './pages/Repeat';

import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

export const store = configureStore();
export const history = syncHistoryWithStore(browserHistory, store);


// Проверяется наличие token в localStorage, т.к кука не ставится для localhost
const requireAuth = () => {
  if (!localStorage.getItem(`simTrackAuthToken`)) {
    history.push('/login');
    return false;
  }
};

const isLogged = () => {
  if (localStorage.getItem(`simTrackAuthToken`)) {
    history.push('/projects');
    return false;
  }
}


export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router key={Math.random()} history={history}>

          <Route path="/" component={MainContainer}>

          <Route path="login" component={Login} onEnter={isLogged} />

          <Route path="/" component={InnerContainer} onEnter={requireAuth}>

              <Route path="dashboard" component={Dashboard} />
              <Route path="repeat" component={Repeat} />
              <Route path="tasks" component={MyTasks} />
              <Route path="projects" component={Projects} />

              <Route path="projects/:projectId" component={ProjectPage}>
                <Route path="agile-board" component={AgileBoard} />
                <Route path="info" component={Info} />
                <Route path="property" component={Property} />
                <Route path="planning" component={Planning} />
                <Route path="analitics" component={Analitics} />
                <Route path="tasks" component={TaskList} />
                <IndexRedirect to="agile-board" />
              </Route>

              <Route
                path="projects/:projectId/tasks/:taskId"
                component={TaskPage}
              />

              <IndexRedirect to="projects" />

            </Route>

            <IndexRedirect to="login" />

          </Route>

        </Router>
      </Provider>
    );
  }
}
