import io from 'socket.io-client';
import { API_URL } from '../constants/Settings';

export default class SocketAdapter {
  constructor(store, channels) {
    this.store = store;
    this.channels = channels;
    this.socket = io({
      path: `${API_URL}/socket`
    });

    this.userAuthState = false;
    this.store.subscribe(() => this.onChangeState());
  }

  onChangeState() {
    const nextUserAuthState = this.getUserAuthState();
    const user = this.getUser();

    if (this.isSignIn(nextUserAuthState)) {
      this.subscribe(user);
    } else if (this.isSignOut(nextUserAuthState)) {
      this.socket.close();
    }

    this.userAuthState = nextUserAuthState;
  }

  isSignIn(nextUserAuthState) {
    return !this.userAuthState && nextUserAuthState;
  }

  isSignOut(nextUserAuthState) {
    return this.userAuthState && !nextUserAuthState;
  }

  getUserAuthState() {
    const { isLoggedIn, loaded, user } = this.store.getState().Auth;
    return isLoggedIn && loaded;
  }

  getUser() {
    return this.store.getState().Auth.user;
  }

  subscribe(user) {
    this.socket.open();
    this.channels.map(channel => {
      this.socket.on(`${channel}_user_${user.id}`, (action) => {
        this.store.dispatch(action);
      })
    })
  }
}
