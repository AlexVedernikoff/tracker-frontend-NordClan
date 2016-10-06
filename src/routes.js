import React from 'react';
import {IndexRedirect, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from './redux/modules/auth';
import {
  App,
  Login,
  TaskPage,
  TasksList,
  NotFound,
} from './containers';
import Scrum from './components/Scrum'
import Project from './components/Project'
import RepeatTime from './components/RepeatTime'

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/login');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="tasks"/>
      <Route path="login" component={Login}/>
      <Route onEnter={requireLogin}>
        <Route path="scrum" component={Scrum} />
        <Route path="project" component={Project} />
        <Route path="task/:taskId" component={TaskPage}/>
        <Route path="tasks" component={TasksList}/>
        <Route path="repeat" component={RepeatTime} />
      </Route>
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
