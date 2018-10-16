import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { taskUpdate } from '../middlewares/Tasks';
import { composeWithDevTools } from 'redux-devtools-extension';
import { restApi } from '../middlewares/RestApi';
import { routerWithSession } from '../middlewares/RouterWithSession';

const configureStore = (preloadedState = {}) => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, routerWithSession, taskUpdate, restApi))
  );

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      () => store.replaceReducer(require('../reducers').default) //eslint-disable-line global-require
    );
  }

  return store;
};

export default configureStore;
