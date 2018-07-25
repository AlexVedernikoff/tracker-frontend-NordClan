import io from 'socket.io-client';
import { API_URL } from '../constants/Settings';

export default class SocketAdapter {
  constructor(store, channels) {
    this.store = store;
    this.channels = channels;
    this.userAuthState = false;
    this.store.subscribe(() => this.onChangeState());
  }

  onChangeState() {
    const nextUserAuthState = this.getUserAuthState();
    const user = this.getUser();

    if (this.isSignIn(nextUserAuthState)) {
      this.subscribe(user);
    } else if (this.isSignOut(nextUserAuthState)) {
      if (this.socket) {
        this.socket.close();
      }
    }

    this.userAuthState = nextUserAuthState;
  }

  getUserAuthState() {
    const { isLoggedIn, loaded } = this.store.getState().Auth;
    return isLoggedIn && loaded;
  }

  getUser() {
    return this.store.getState().Auth.user;
  }

  createSocketConnection() {
    token = this.getToken();
    socket = io({
      path: `${API_URL}/socket`,
      transports: ['websocket']
    });
  }

  getToken() {
    return this.store.getState.Auth.token;
  }

  isSignIn(nextUserAuthState) {
    return !this.userAuthState && nextUserAuthState;
  }

  isSignOut(nextUserAuthState) {
    return this.userAuthState && !nextUserAuthState;
  }

  subscribe(user) {
    console.log('socket');
    if (!this.socket) {
      this.socket = createSocketConnection();
    } else {
      this.socket.open();
    }
    this.channels.map(channel => {
      this.socket.on(`${channel}_user_${user.id}`, action => {
        this.store.dispatch(action);
      });
    });
  }
}
