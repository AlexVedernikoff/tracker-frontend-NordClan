import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import ProjectPage from './pages/ProjectPage';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Repeat from './pages/Repeat';

export default class AppRouter extends Component {
  render () {
    return (
      <Router key={Math.random()} history={browserHistory}>
        <Route path="/" component={InnerContainer}>
          <Route path="dashboard" component={Dashboard} />
          <Route path="repeat" component={Repeat} />
          <Route path="tasks" component={Tasks} />
          <Route path="projects" component={Projects}/>
          <Route path="projects/:projectId" component={ProjectPage} />
          <Route path="projects/:projectId/:taskId" component={TaskPage} />
        </Route>
      </Router>
    );
  }
}
