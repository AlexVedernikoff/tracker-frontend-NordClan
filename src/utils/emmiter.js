import EventEmitter from 'events';
import io from 'socket.io-client';
import { API_URL } from '../constants/Settings';

export const SOCKET_UP = 'socket_up';

export const SOCKET_DOWN = 'socket_down';

const channels = ['task', 'project', 'timesheet'];

const createSocketConnection = token => {
  token = this.getToken();
  return (socket = io({
    path: `${API_URL}/socket`,
    transports: ['websocket']
  }));
};

const subscribeSocketActions = (socket, store) => {
  channels.map(channel => {
    socket.on(`${channel}_user_${user.id}`, action => {
      store.dispatch(action);
    });
  });
};

const eventEmitter = new EventEmitter();

eventEmitter.on(SOCKET_UP, store => {
  const socket = createSocketConnection(store.Auth.token);
  subscribeSocketActions(socket, store);
  socket.open();
});

export default eventEmitter;
