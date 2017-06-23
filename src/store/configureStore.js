import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers';

console.log('NODE_ENV:', process.env.NODE_ENV); // eslint-disable-line

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, logger];
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export default function configureStore() {
  return createStore(
        rootReducer,
        /* preloadedState, */
        composeEnhancers(applyMiddleware(...middleware)),
    );
}
