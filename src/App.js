import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppRoute from './Router';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import 'normalize-css';
import './styles/hooks.css';
import './styles/App.scss';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
const rootEl = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <AppRoute />
    </AppContainer>,
    rootEl
  );
};

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./Router', render);
  }
}

render();
