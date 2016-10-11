import React from 'react';
import {IndexRedirect, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from './actions/auth';
import {
  App,
  Login,
  TaskPage,
  TasksList,
  NotFound,
} from './containers';

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
      { /* Home (main) route */ }
      <IndexRedirect to="tasks"/>
      { /* Routes */ }
      <Route path="login" component={Login}/>
      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="task/:taskId" component={TaskPage}/>
        <Route path="tasks" component={TasksList}/>
      </Route>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
