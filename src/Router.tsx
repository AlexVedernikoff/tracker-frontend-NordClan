import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRedirect, IndexRoute, applyRouterMiddleware } from 'react-router';
import { connect } from 'react-redux';
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
import TestsPage from './pages/ProjectPage/TestsPage';
import Metrics from './pages/ProjectPage/Metrics';
import TaskList from './pages/ProjectPage/TaskList';
import ProjectTimesheets from './pages/ProjectPage/ProjectTimesheets';
import MyTasks from './pages/MyTasks';
import MyTaskDevOps from './pages/MyTasksDevOps';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Timesheets from './pages/Timesheets';
import UsersRoles from './pages/UsersRoles';
import NotFound from './pages/NotFound';
import User from './pages/User';
import UsersProfile from './pages/UsersProfile';
import RedirectPage from './pages/Redirect';
import ExternalUsers from './pages/ExternalUsers';
import ExternalUserActivate from './pages/ExternalUserActivate';
import TaskTimeReports from './pages/TaskPage/TaskTimeReports/TaskTimeReports';
import CompanyTimeSheets from './pages/CompanyTimeSheets';

import DemoPage from './components/Icons/DemoPage';
import JiraWizard from './components/Wizard';

import { clearCurrentProjectAndTasks } from './actions/Tasks';
import { clearCurrentTask } from './actions/Task';
import { setRedirectPath } from './actions/Authentication';
import { clearTimeSheetsState } from './actions/Timesheets';

import { EXTERNAL_USER } from './constants/Roles';

import { isVisor } from './utils/isVisor';
import isAdmin from './utils/isAdmin';
import isHR from './utils/isHR';
import TestingCaseReference from './pages/TestingCaseReference';
import TestingCase from './pages/TestingCase';
import ProjectTestingCase from './pages/ProjectPage/TestCase';
import TestPlan from './pages/ProjectPage/TestsPage/TestPlan';
import TestRun from './pages/ProjectPage/TestsPage/TestRun';
import TestRunEE from './pages/ProjectPage/TestsPage/TestRunExecute';

import TCRDemoPage from './components/TestingCaseReference/Demo';

/*https://github.com/olegakbarov/react-redux-starter-kit/blob/master/src/routes.js
* переделки:
* для ролей использовать этот принцип
* систему ролей продумать
* по сути обернуть разные слои доступа в отдельныке условные компоненты, сделать их прямыми слушателями
* хранилища и соответсвенно редиректы
* */

interface Props {
  isLoggedIn: boolean
  loaded: boolean
  history: any
  userGlobalRole: any
  userProjectRoles: any

  setRedirectPath: Function
  clearTimeSheetsState: Function
  clearCurrentProjectAndTasks: Function
  clearCurrentTask: Function
}

class AppRouter extends Component<Props> {
  static propTypes = {
    clearCurrentProjectAndTasks: PropTypes.func,
    clearCurrentTask: PropTypes.func,
    clearTimeSheetsState: PropTypes.func,
    history: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    loaded: PropTypes.bool,
    redirectPath: PropTypes.object,
    setRedirectPath: PropTypes.func,
    userGlobalRole: PropTypes.string,
    userProjectRoles: PropTypes.object
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

  requireAdmin = (nextState, replace, cb) => {
    if (
      !isAdmin(this.props.userGlobalRole) &&
      !this.props.userProjectRoles.admin.find(role => role === +nextState.params.projectId)
    ) {
      replace('/projects');
    }
    cb();
  };

  requireAdminHR = (nextState, replace, cb) => {
    const { userGlobalRole, userProjectRoles } = this.props;

    const noPermissions =
      !isAdmin(userGlobalRole) &&
      !isHR(userGlobalRole) &&
      !userProjectRoles.admin.find(role => role === +nextState.params.projectId);

    if (noPermissions) {
      replace('/projects');
    }

    cb();
  };

  onCompanyTimesheetsEnter = (_nextState, replace, cb) => {
    if (isAdmin(this.props.userGlobalRole) || isVisor(this.props.userGlobalRole)) {
      this.props.clearTimeSheetsState();
      return cb();
    }
    replace('/projects');
  };

  notExternal = (_nextState, replace, cb) => {
    if (this.props.userGlobalRole === EXTERNAL_USER) {
      replace('/projects');
    }
    cb();
  };

  onProjectPageLeave = nextState => {
    localStorage.setItem('filtersData', nextState.location.search);
    if (nextState.location.search === '') {
      localStorage.setItem('filtersData', '?changedSprint=0');
    }
    this.props.clearCurrentProjectAndTasks();
  };

  router = (
    <Router history={this.props.history} render={applyRouterMiddleware(useScroll(() => false))}>
      <Route path="" component={MainContainer}>
        <Route path="login" component={Login} onEnter={this.isLogged} />
        <Route path="externalUserActivate/:exUserToken" component={ExternalUserActivate} onEnter={this.isLogged} />
        <Route path="logout" component={Logout} />
        <Route path="/" component={InnerContainer} onEnter={this.requireAuth}>
          <Route path="dashboard" component={Dashboard} />
          <Route
            path="timereports"
            component={Timesheets}
            onEnter={this.notExternal}
            onLeave={this.props.clearTimeSheetsState}
          />
          <Route
            path="company-timereports"
            component={CompanyTimeSheets}
            onEnter={this.onCompanyTimesheetsEnter}
            onLeave={this.props.clearTimeSheetsState}
          />
          <Route path="/user/:id" component={User} />
          <Route path="/users-profile/:id" component={UsersProfile} onEnter={this.requireAdminHR} />
          <Route path="/users-profile/" component={UsersProfile} />
          <Route path="roles/archive" component={UsersRoles} onEnter={this.requireAdminHR} />
          <Route path="/user" component={User} />
          <Route path="roles" component={UsersRoles} onEnter={this.requireAdminHR} />
          <Route path="tasks" component={MyTasks} onLeave={this.props.clearCurrentProjectAndTasks} />
          <Route path="tasks-devops" component={MyTaskDevOps} onLeave={this.props.clearCurrentProjectAndTasks} />
          <Route path="projects" component={Projects} />
          <Route path="testing-case-reference" component={TestingCaseReference} onEnter={this.requireAdmin} />
          <Route path="test-case/:id" component={TestingCase} onEnter={this.requireAdmin} />
          <Route path="externalUsers" component={ExternalUsers} onEnter={this.requireAdmin} />
          <Route path="projects/:projectId" component={ProjectPage} scrollToTop>
            <IndexRoute component={AgileBoard} />
            <Route path="info" component={Info} />
            <Route path="property" component={Settings} />
            <Route path="planning" component={Planning} />
            <Route path="tests" component={TestsPage}>
              <Route path=":testsPage" component={TestsPage} />
            </Route>
            <Route path="analytics" component={Metrics}>
              <Route path=":metricType" component={Metrics} />
            </Route>
            <Route
              path="timesheets"
              component={ProjectTimesheets}
              onEnter={this.props.clearTimeSheetsState}
              onLeave={this.props.clearTimeSheetsState}
            />
            <Route path="history" component={ProjectHistory} />
            <Route path="(sprint:sprintId/)tasks" component={TaskList} />
          </Route>
          <Route path="projects/:projectId/jira-wizard" component={JiraWizard} scrollToTop />
          <Route path="projects/:projectId/test-case/:id" component={ProjectTestingCase} onEnter={this.requireAdmin} />
          <Route path="projects/:projectId/test-plan/:testRunId" component={ TestPlan } />
          <Route path="projects/:projectId/test-run/:testRunExecutionId" component={TestRun} />
          <Route path="projects/:projectId/test-run-execute/:testRunExecutionId" component={TestRunEE} />

          <Route path="projects/portfolio/:portfolioId" component={Portfolio} scrollToTop />

          <Route
            path="projects/:projectId/tasks/:taskId"
            component={TaskPage}
            onLeave={this.props.clearCurrentTask}
            ignoreScrollBehavior
          >
            <IndexRoute component={Comments} />
            <Route path="history" component={TaskHistory} onEnter={this.notExternal} />
            <Route path="time-reports" component={TaskTimeReports} onEnter={this.requireAdmin} />
          </Route>

          {
            (process.env.NODE_ENV === 'development') ?  (
              <>
                <Route path="demo_tcr" component={TCRDemoPage} />
                <Route path="icons" component={DemoPage} />
              </>
            ): null
          }


          <IndexRedirect to="projects" />
        </Route>
        <IndexRedirect to="login" />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  );

  render() {
    return this.props.loaded ? this.router : <RedirectPage />;
  }
}

const mapStateToProps = ({ Auth: { loaded, isLoggedIn, redirectPath, user } }) => ({
  loaded,
  isLoggedIn,
  redirectPath,
  userGlobalRole: user.globalRole,
  userProjectRoles: user.projectsRoles
});

const mapDispatchToProps = {
  setRedirectPath,
  clearCurrentProjectAndTasks,
  clearTimeSheetsState,
  clearCurrentTask
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
