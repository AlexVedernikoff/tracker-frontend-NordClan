import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Router,
  Route,
  IndexRedirect,
  applyRouterMiddleware
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { getComments } from './actions/Task';
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
import Analitics from './pages/ProjectPage/Analitics';
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
import AuthRoute from './components/AuthRoute';
import { connect } from 'react-redux';

/*https://github.com/olegakbarov/react-redux-starter-kit/blob/master/src/routes.js
* переделки:
* для ролей использовать этот принцип
* систему ролей продумать
* по сути обернуть разные слои доступа в отдельныке условные компоненты, сделать их прямыми слушателями
* хранилища и соответсвенно редиректы
* */

class AppRouter extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    history: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    loaded: PropTypes.bool
  };

  requireAuth = (nextState, replace, cb) => {
    if (!this.props.isLoggedIn) {
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

  render () {
    return (
      this.props.loaded
        ? <Router history={this.props.history} render={applyRouterMiddleware(useScroll(()=>false))}>
          <Route path="/" component={MainContainer} >
            {/*<AuthRoute path="login" component={Login} allowed={!this.props.isLoggedIn} otherwise="projects" />*/}
            <Route path="login" component={Login} onEnter={this.isLogged} />
            <Route path="icons" component={DemoPage} />
            <Route path="logout" component={Logout} />
            {/*<AuthRoute path="/" component={InnerContainer} allowed={this.props.isLoggedIn} otherwise="login" >*/}
            <Route path="/" component={InnerContainer} onEnter={this.requireAuth} >
              <Route path="dashboard" component={Dashboard} />
              <Route path="timesheets" component={Timesheets} />
              <Route path="tasks" component={MyTasks} />
              <Route path="projects" component={Projects} />

              <Route path="projects/:projectId" component={ProjectPage} scrollToTop >
                <Route path="agile-board" component={AgileBoard} />
                <Route path="info" component={Info} />
                <Route path="property" component={Settings} />
                <Route path="planning" component={Planning} />
                <Route path="analitics" component={Analitics} />
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
                <Route path="comments" component={Comments}/>
                <Route path="history" component={TaskHistory}/>
                <IndexRedirect to="comments" />
              </Route>

              <IndexRedirect to="projects" />
            </Route>
            {/*</AuthRoute>*/}
            <IndexRedirect to="login" />
          </Route>
          <Route path="*" component={NotFound} />
        </Router>
        : <RedirectPage />
    );
  }
}

const mapStateToProps = ({ Auth: { loaded, isLoggedIn } }) => ({
  loaded,
  isLoggedIn
});

export default connect(mapStateToProps)(AppRouter);
