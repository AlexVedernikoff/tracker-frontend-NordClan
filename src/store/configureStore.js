import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware),
      typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
    )
  );
};

export default configureStore;
