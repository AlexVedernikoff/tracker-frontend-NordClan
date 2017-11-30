import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Router,
  Route,
  IndexRedirect,
  IndexRoute,
  applyRouterMiddleware
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import MainContainer from './pages/MainContainer';
import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import Comments from './pages/TaskPage/Comments';
import TaskHistory from './pages/TaskPage/TaskHistory';
import ProjectHistory from './pages/ProjectPage/ProjectHistory';
import ProjectPage from './pages/ProjectPage';
import Portfolio from './pages/Portfolio';
import AgileBoard from './pages/ProjectPage/AgileBoard';
import Info from './pages/ProjectPage/Info';
import Settings from './pages/ProjectPage/Settings';
import Planning from './pages/ProjectPage/Planning';
import Metrics from './pages/ProjectPage/Metrics';
import TaskList from './pages/ProjectPage/TaskList';
import MyTasks from './pages/MyTasks';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Timesheets from './pages/Timesheets';
import NotFound from './pages/NotFound';
import RedirectPage from './pages/Redirect';
import DemoPage from './components/Icons/DemoPage';
import { connect } from 'react-redux';
import { clearCurrentProjectAndTasks } from './actions/Tasks';
import { setRedirectPath } from './actions/Authentication';

/*https://github.com/olegakbarov/react-redux-starter-kit/blob/master/src/routes.js
* переделки:
* для ролей использовать этот принцип
* систему ролей продумать
* по сути обернуть разные слои доступа в отдельныке условные компоненты, сделать их прямыми слушателями
* хранилища и соответсвенно редиректы
* */

class AppRouter extends Component {
  static propTypes = {
    clearCurrentProjectAndTasks: PropTypes.func,
    history: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    loaded: PropTypes.bool,
    redirectPath: PropTypes.object,
    setRedirectPath: PropTypes.func
  };

  requireAuth = (nextState, replace, cb) => {
    if (!this.props.isLoggedIn) {
      this.props.setRedirectPath(this.props.history.getCurrentLocation());
      replace('/login');
    }
    cb();
  };

// Auth check for login page
  isLogged = (nextState, replace, cb) => {
    if (this.props.isLoggedIn) {
      replace('/projects');
    }
    cb();
  };

  clearTasks = () => {
    this.props.clearCurrentProjectAndTasks();
  };

  render () {
    return (
      this.props.loaded
        ? <Router history={this.props.history} render={applyRouterMiddleware(useScroll(()=>false))}>
          <Route path="" component={MainContainer} >
            <Route path="login" component={Login} onEnter={this.isLogged} />
            <Route path="icons" component={DemoPage} />
            <Route path="logout" component={Logout} />
            <Route path="/" component={InnerContainer} onEnter={this.requireAuth} >
              <Route path="dashboard" component={Dashboard} />
              <Route path="timesheets" component={Timesheets} />
              <Route path="tasks" component={MyTasks} />
              <Route path="projects" component={Projects} />

              <Route path="projects/:projectId" component={ProjectPage} scrollToTop onLeave={this.clearTasks} >
                <Route path="agile-board" component={AgileBoard} />
                <Route path="info" component={Info} />
                <Route path="property" component={Settings} />
                <Route path="planning" component={Planning} />
                <Route path="metrics" component={Metrics} />
                <Route path="history" component={ProjectHistory} />
                <Route path="(sprint:sprintId/)tasks" component={TaskList} />
                <IndexRedirect to="agile-board" />
              </Route>

              <Route path="projects/portfolio/:portfolioId" component={Portfolio} scrollToTop />

              <Route
                path="projects/:projectId/tasks/:taskId"
                component={TaskPage}
                ignoreScrollBehavior
              >
                <IndexRoute component={Comments}/>
                <Route path="history" component={TaskHistory}/>
              </Route>

              <IndexRedirect to="projects" />
            </Route>
            <IndexRedirect to="login" />
          </Route>
          <Route path="*" component={NotFound} />
        </Router>
        : <RedirectPage />
    );
  }
}

const mapStateToProps = ({ Auth: { loaded, isLoggedIn, redirectPath } }) => ({
  loaded,
  isLoggedIn,
  redirectPath
});

const mapDispatchToProps = {
  setRedirectPath,
  clearCurrentProjectAndTasks
};
export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
