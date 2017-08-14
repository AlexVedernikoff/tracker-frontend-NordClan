import React, { Component } from 'react';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  IndexRedirect,
  Redirect,
  applyRouterMiddleware
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { getInfoAboutMe } from './actions/Authentication';

import MainContainer from './pages/MainContainer';
import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import Comments from './pages/TaskPage/Comments';
import TaskHistory from './pages/TaskPage/TaskHistory';
import ProjectPage from './pages/ProjectPage';
import Portfolio from './pages/Portfolio';
import AgileBoard from './pages/ProjectPage/AgileBoard';
import Info from './pages/ProjectPage/Info';
import Settings from './pages/ProjectPage/Settings';
import Planning from './pages/ProjectPage/Planning';
import Analitics from './pages/ProjectPage/Analitics';
import TaskList from './pages/ProjectPage/TaskList';
import MyTasks from './pages/MyTasks';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Repeat from './pages/Repeat';
import NotFound from './pages/NotFound';
import DemoPage from './components/Icons/DemoPage';

import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

export const store = configureStore();
export const history = syncHistoryWithStore(browserHistory, store);

let auth = { isLoggedIn: false };

const appLoad = (nextState, replace, cb) => {
  store.dispatch(getInfoAboutMe()).then(() => cb(), () =>cb());
  store.subscribe(() => {
    const { Auth: { isLoggedIn } } = store.getState();
    auth = { isLoggedIn };
  });
};
// Auth check for Auth-required pages
const requireAuth = function (nextState, replace, cb) {
  if (!auth.isLoggedIn) {
    replace('/login');
  }
  cb();
};

// Auth check for login page
const isLogged = function (nextState, replace, cb) {
  if (auth.isLoggedIn) {
    replace('/projects');
  }
  cb();
};

export default class AppRouter extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router key={Math.random()} history={history} render={applyRouterMiddleware(useScroll(()=>false))}>
          <Route path="/" component={MainContainer} onEnter={appLoad}>
            <Route path="login" component={Login} onEnter={isLogged} />
            <Route path="icons" component={DemoPage} />
            <Route path="logout" component={Logout} />

            <Route path="/" component={InnerContainer} onEnter={requireAuth} >
              <Route path="dashboard" component={Dashboard} />
              <Route path="repeat" component={Repeat} />
              <Route path="tasks" component={MyTasks} />
              <Route path="projects" component={Projects} />

              <Route path="projects/:projectId" component={ProjectPage} scrollToTop >
                <Route path="agile-board" component={AgileBoard} />
                <Route path="info" component={Info} />
                <Route path="property" component={Settings} />
                <Route path="planning" component={Planning} />
                <Route path="analitics" component={Analitics} />
                <Route path="(sprint:sprintId/)tasks" component={TaskList} />
                <IndexRedirect to="agile-board" />
              </Route>

              <Route path="projects/portfolio/:portfolioId" component={Portfolio} scrollToTop />

              <Route
                path="projects/:projectId/tasks/:taskId"
                component={TaskPage}
                ignoreScrollBehavior
              >
                <Route path="comments" component={Comments}/>
                <Route path="history" component={TaskHistory}/>
                <IndexRedirect to="comments" />
              </Route>

              <IndexRedirect to="projects" />
            </Route>

            <IndexRedirect to="login" />
          </Route>
          <Route path="*" component={NotFound} />
        </Router>
      </Provider>
    );
  }
}
