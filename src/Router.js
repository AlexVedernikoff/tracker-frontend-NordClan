import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';

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

export default class AppRouter extends Component {
  render () {
    return (
      <Router key={Math.random()} history={browserHistory}>

        <Route path="/" component={MainContainer}>

          <Route path="login" component={Login} />

          <Route path="/" component={InnerContainer}>

            <Route path="dashboard" component={Dashboard} />
            <Route path="repeat" component={Repeat} />
            <Route path="tasks" component={MyTasks} />
            <Route path="projects" component={Projects}/>

            <Route path="projects/:projectId" component={ProjectPage}>
              <Route path="agile-board" component={AgileBoard}/>
              <Route path="info" component={Info}/>
              <Route path="property" component={Property}/>
              <Route path="planning" component={Planning}/>
              <Route path="analitics" component={Analitics}/>
              <Route path="tasks" component={TaskList}/>
              <IndexRedirect to="agile-board"/>
            </Route>

            <Route path="projects/:projectId/tasks/:taskId" component={TaskPage} />

            <IndexRedirect to="projects"/>

          </Route>

          <IndexRedirect to="login"/>

        </Route>

      </Router>
    );
  }
}
