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
import {
  FirstDay,
  Info as CommonInfo,
  Timesheets as InfoTimesheets,
  Memo,
  SoftInfo,
  Philosophy,
  LogTime,
} from "~/pages/CommonInfo";

import DemoPage from './components/Icons/DemoPage';
import JiraWizard from './components/Wizard';

import { clearCurrentProjectAndTasks } from './actions/Tasks';
import { clearCurrentTask } from './actions/Task';
import { setRedirectPath } from './actions/Authentication';
import { clearTimeSheetsState } from './actions/Timesheets';

// import { EXTERNAL_USER } from './constants/Roles';

import checkRoles from './utils/checkRoles';
import TestingCaseReference from './pages/TestingCaseReference';
import TestingCase from './pages/TestingCase';
import ProjectTestingCase from './pages/ProjectPage/TestCase';
import TestPlan from './pages/ProjectPage/TestsPage/TestPlan';
import TestRun from './pages/ProjectPage/TestsPage/TestRun';
import TestRunExecute from './pages/ProjectPage/TestsPage/TestRunExecute';

import TCRDemoPage from './components/TestingCaseReference/Demo';

/*https://github.com/olegakbarov/react-redux-starter-kit/blob/master/src/routes.js
* переделки:
* для ролей использовать этот принцип
* систему ролей продумать
* по сути обернуть разные слои доступа в отдельныке условные компоненты, сделать их прямыми слушателями
* хранилища и соответсвенно редиректы
* */
type UserProject = {
  projectId: number;
  roles: Array<{
    projectRoleId: number
  }>
}
interface Props {
  isLoggedIn: boolean;
  loaded: boolean;
  history: any;
  userGlobalRole: any;
  userProjectRoles: any;

  setRedirectPath: Function;
  clearTimeSheetsState: Function;
  clearCurrentProjectAndTasks: Function;
  clearCurrentTask: Function;
  redirectPath: object;
  userProjects: Array<UserProject>;
}

class AppRouter extends Component<Props> {
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
      !checkRoles.isAdmin(this.props.userGlobalRole) &&
      !this.props.userProjectRoles.admin.find(role => role === +nextState.params.projectId)
    ) {
      replace('/projects');
    }
    cb();
  };

  requireProjectPMorQA = (nextState, replace, cb) => {
    const userProject: UserProject | undefined = this.props.userProjects.find(el => el.projectId === +nextState.params.projectId);
    if ( !userProject || userProject.roles.find(el => el.projectRoleId === 2 || el.projectRoleId === 9) === undefined) {
      replace('/projects');
    }
    cb();
  };

  requireAdminHR = (nextState, replace, cb) => {
    const { userGlobalRole, userProjectRoles } = this.props;

    const noPermissions =
      !checkRoles.isAdmin(userGlobalRole) &&
      !checkRoles.isHR(userGlobalRole) &&
      !userProjectRoles.admin.find(role => role === +nextState.params.projectId);

    if (noPermissions) {
      replace('/projects');
    }
    cb();
  };


  testCaseReferenceAccess = (nextState, replace, cb) => {
    // for roles ADMIN | VISOR | USER
    const {userGlobalRole} = this.props;
    const hasRole = checkRoles.isAdmin(userGlobalRole) || checkRoles.isVisor(userGlobalRole) || checkRoles.isUser(userGlobalRole);
    if ( !hasRole  ) {
      replace('/projects');
    }
    cb();
  };

  onCompanyTimesheetsEnter = (_nextState, replace, cb) => {
    if (!checkRoles.isAdmin(this.props.userGlobalRole) && !checkRoles.isVisor(this.props.userGlobalRole)) {
      replace('/projects');
    }
    this.props.clearTimeSheetsState();
    return cb();
  };

  notExternal = (_nextState, replace, cb) => {
    if (checkRoles.isExternalUser(this.props.userGlobalRole)) {
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
          <Route
            path="/common-info"
            component={CommonInfo}
          >
            <Route
              path="philosophy"
              component={Philosophy}
            />
            <Route
              path="first-day"
              component={FirstDay}
            />
            <Route
              path="timesheets"
              component={InfoTimesheets}
            />
            <Route
              path="memo"
              component={Memo}
            />
            <Route
              path="soft-info"
              component={SoftInfo}
            />

            <Route
              path="logtime"
              component={LogTime}
            />
          </Route>
          <Route path="/user/:id" component={User} />
          <Route path="/users-profile/:id" component={UsersProfile} onEnter={this.requireAdminHR} />
          <Route path="/users-profile/" component={UsersProfile} />
          <Route path="roles/archive" component={UsersRoles} onEnter={this.requireAdminHR} />
          <Route path="/user" component={User} />
          <Route path="roles" component={UsersRoles} onEnter={this.requireAdminHR} />
          <Route path="tasks" component={MyTasks} onLeave={this.props.clearCurrentProjectAndTasks} />
          <Route path="tasks-devops" component={MyTaskDevOps} onLeave={this.props.clearCurrentProjectAndTasks} />
          <Route path="projects" component={Projects} />
          <Route path="testing-case-reference" component={TestingCaseReference} onEnter={this.testCaseReferenceAccess} />
          <Route path="test-case/:id" component={TestingCase} onEnter={this.testCaseReferenceAccess} />
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
          <Route path="projects/:projectId/test-case/:id" component={ProjectTestingCase} onEnter={this.requireProjectPMorQA} />
          <Route path="projects/:projectId/test-plan/:testRunId" component={ TestPlan } />
          <Route path="projects/:projectId/test-run/:testRunExecutionId" component={TestRun} />
          <Route path="projects/:projectId/test-run-execute/:testRunExecutionId" component={TestRunExecute} />

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
  userProjectRoles: user.projectsRoles,
  userProjects: user.usersProjects,
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
