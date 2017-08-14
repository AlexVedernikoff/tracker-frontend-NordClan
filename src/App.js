import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppRoute from './Router';
import { browserHistory } from 'react-router';

import 'normalize-css';
import './styles/hooks.css';
import './styles/App.scss';

import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { getInfoAboutMe } from './actions/Authentication';

export const store = configureStore();
export const history = syncHistoryWithStore(browserHistory, store);
const rootEl = document.getElementById('app');

const render = (App) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
          <App history={history}/>
      </Provider>
    </AppContainer>,
    rootEl
  );
};

store.dispatch(getInfoAboutMe());

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./Router', () => render(require('./Router').default));
  }
}

render(AppRoute);
