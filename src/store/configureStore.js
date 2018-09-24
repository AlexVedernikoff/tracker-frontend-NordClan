import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { taskUpdate } from '../middlewares/Tasks';
import { restApi } from '../middlewares/RestApi';
import { routerWithSession } from '../middlewares/RouterWithSession';

const configureStore = preloadedState => {
  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, routerWithSession, taskUpdate, restApi));

  return store;
};

export default configureStore;
