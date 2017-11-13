import io from 'socket.io-client';
import { API_URL } from '../constants/Settings';

export default class SocketAdapter {
  constructor(store, entity) {
    this.store = store;
    this.entity = entity;
    this.socket = io.connect({
      path: `${API_URL}/socket`
    });
  }
}
