import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';

import InnerContainer from './pages/InnerContainer';
import TaskPage from './pages/TaskPage';
import ProjectPage from './pages/ProjectPage';
  import AgileBoard from './pages/ProjectPage/AgileBoard';
  import Info from './pages/ProjectPage/Info';
  import Property from './pages/ProjectPage/Property';
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
          <Route path="projects/:projectId" component={ProjectPage}>
            <Route path="agile-board" component={AgileBoard}/>
            <Route path="info" component={Info}/>
            <Route path="property" component={Property}/>
            <IndexRedirect to="agile-board"/>
          </Route>
          <Route path="projects/:projectId/tasks/:taskId" component={TaskPage} />
        </Route>
      </Router>
    );
  }
}
