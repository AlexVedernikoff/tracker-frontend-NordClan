import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './Router';

import 'normalize.css';
import './styles/hooks.css';
import './styles/App.scss';

import { store, history } from './History';

import { Provider } from 'react-redux';
import { getInfoAboutMe } from './actions/Authentication';

import SocketAdapter from './sockets/SocketAdapter';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import { AppContainer } from 'react-hot-loader';
const rootEl = document.getElementById('app');

const channels = ['task', 'project', 'timesheet', 'comments'];
const socket = new SocketAdapter(store, channels);

window.log = require('./utils/logger');

store.dispatch(getInfoAboutMe());

const render = App => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
          <App history={history} socket={socket} />
        </DragDropContextProvider>
      </Provider>
    </AppContainer>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept('./Router', () => render(require('./Router').default));
}

render(AppRoute);
