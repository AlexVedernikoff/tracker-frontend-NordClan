import SocketAdapter from './SocketAdapter';

export default class TaskSocket extends SocketAdapter {
  constructor(store) {
    const entity = 'task';
    super(store, entity);
  }

  connect() {
    const userId = this.store.getState().Auth.user.id;
    this.socket.on(`${this.entity}_user_${userId}`, (action) => {
      this.store.dispatch(action);
    })
  }
}
