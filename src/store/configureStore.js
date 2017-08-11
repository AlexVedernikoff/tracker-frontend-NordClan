import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { taskUpdate } from '../middlewares/Tasks';
import { composeWithDevTools } from 'redux-devtools-extension';

const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, taskUpdate)
    )
  );
};

export default configureStore;
