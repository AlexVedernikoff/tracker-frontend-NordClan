import React from 'react';
import ReactDOM from 'react-dom';
import App from './Router';

import 'normalize.css';
import './styles/hooks.css';
import './styles/App.scss';

import { history, store } from './History';

import { Provider } from 'react-redux';
import { getInfoAboutMe } from './actions/Authentication';

import SocketAdapter from './sockets/SocketAdapter';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import { StoreService } from './utils';

const rootEl = document.getElementById('app');

const channels = ['task', 'project', 'timesheet', 'comments', 'jira'];
const socket = new SocketAdapter(store, channels);

window.log = require('./utils/logger/noop');

store.dispatch(getInfoAboutMe());
StoreService.init(store);

ReactDOM.render(
  <Provider store={store}>
    <DragDropContextProvider backend={HTML5Backend}>
      <App history={history} socket={socket} />
    </DragDropContextProvider>
  </Provider>,
  rootEl
);
