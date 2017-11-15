import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppRoute from './Router';

import 'normalize-css';
import './styles/hooks.css';
import './styles/App.scss';
import { store, history } from './History';

import { Provider } from 'react-redux';
import { getInfoAboutMe } from './actions/Authentication';

import SocketAdapter from './sockets/SocketAdapter';

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

//TODO добавление новой сущности требует лишь добавить её название
//в список каналов
const channels = ['task', 'project'];
const socket = new SocketAdapter(store, channels);

store.dispatch(getInfoAboutMe());

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./Router', () => render(require('./Router').default));
  }
}

render(AppRoute);
