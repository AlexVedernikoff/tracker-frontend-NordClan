import io from 'socket.io-client';
import {
  SOCKET_URL,
  DEMO_ACTION,
  SOCKET_IO
} from '../constants/SocketIO';
import { demoAction } from '../actions/SocketIO';

const actions = {
  [DEMO_ACTION]: demoAction
};

const uid = btoa(`${Date.now()}${Math.random()}`);

const isConsistant = () => true;

const sendOverSocket = (client, { event, type, start, success, error, ...data }, store) => {

  const handler = (res) => {
    if (res.uid === uid) {
      if (res && res.status === 200) {
        success(res);
      } else {
        error(res);
      }
      client.off(event, handler);
    }
  };

  start();
  client.emit(event, { ...data, uid });
  client.on(event, handler);
};


export const socketIO = (store) => {
  const socket = io(SOCKET_URL);
  return (next) => {

    socket.on(DEMO_ACTION, (data) => next(actions[DEMO_ACTION](data)));

    return (action) => {
      if (action.type !== SOCKET_IO) {
        return next(action);
      }
      if (isConsistant(action)) {
        sendOverSocket(socket, action, store);
      }
    };
  };
};
