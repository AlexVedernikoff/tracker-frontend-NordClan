import io from 'socket.io-client';
import { API_URL } from '../constants/Settings';
import dispatchSocketAction from './dispatchSocketAction';

export default class SocketAdapter {
  constructor(store, channels) {
    this.store = store;
    this.channels = channels;
    this.userAuthState = false;
    this.store.subscribe(() => this.onChangeState());
  }

  setConnection() {
    this.socket = io({
      path: `${API_URL}/socket`,
      transports: ['websocket']
    });
  }

  onChangeState() {
    const nextUserAuthState = this.getUserAuthState();
    const user = this.getUser();

    if (this.isSignIn(nextUserAuthState)) {
      if (!this.socket) {
        this.setConnection();
      }
      this.subscribe(user);
    } else if (this.isSignOut(nextUserAuthState)) {
      this.socket.close();
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

  isSignIn(nextUserAuthState) {
    return !this.userAuthState && nextUserAuthState;
  }

  isSignOut(nextUserAuthState) {
    return this.userAuthState && !nextUserAuthState;
  }

  //When an action comes from the server with the isSocket attribute,
  // this is a notification for the ui
  // that will have to update the data on the HTTP request
  subscribe(user) {
    this.socket.open();
    this.channels.map(channel => {
      this.socket.on(`${channel}_user_${user.id}`, action => {
        if (action.isSocket) {
          dispatchSocketAction(action, this.store);
        } else {
          this.store.dispatch(action);
        }
      });
    });
  }
}
