import io from 'socket.io-client';
import {
  SOCKET_URL,
  SOCKET_IO
} from '../constants/SocketIO';
import { API_URL } from '../constants/Settings';

const socket = io.connect({
  path: `${API_URL}/socket`
});

export const socketIO = (store) => (next) => (action) => {

  if (action.type !== SOCKET_IO) {
    return next(action);
  }

  socket.on(action.channel, (data) => {
    action.onReceive(store.dispatch, data);
  })
};
