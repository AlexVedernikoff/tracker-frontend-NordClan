import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './Router';
import ErrorBoundary from './components/ErrorBoundary';
import 'mobx-react-lite/batchingForReactDom';

import 'normalize.css';
import './styles/hooks.css';
import './styles/App.scss';

import { store, history } from './History';

import { Provider } from 'react-redux';
import { getInfoAboutMe } from './actions/Authentication';

import SocketAdapter from './sockets/SocketAdapter';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import { StoreService } from './utils';

import { AppContainer } from 'react-hot-loader';
import { applyGuideInterceptors } from '~/guides/utils/interceptors';

const rootEl = document.getElementById('app');

const channels = ['task', 'project', 'timesheet', 'comments', 'jira'];
const socket = new SocketAdapter(store, channels);

window.log = require('./utils/logger');

store.dispatch(getInfoAboutMe());

StoreService.init(store);

applyGuideInterceptors(axios);

const render = App => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ErrorBoundary>
          <DragDropContextProvider backend={HTML5Backend}>
            <App history={history} socket={socket} />
          </DragDropContextProvider>
        </ErrorBoundary>
      </Provider>
    </AppContainer>,
    rootEl
  );
};

render(AppRoute);
