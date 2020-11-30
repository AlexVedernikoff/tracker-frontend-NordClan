class Store {
  static store = null;
  static dispatch = null;
  static getState = null;
}

export class StoreService {
  static init = store => {
    Store.store = store;
    Store.dispatch = store.dispatch;
    Store.getState = store.getState;
  };

  static destruct = () => {
    Store.store = null;
    Store.dispatch = null;
    Store.getState = null;
  };

  static get store() {
    return Store.store;
  }

  static set store(store) {
    Store.store = store;
  }

  static set dispatch(dispatch) {
    Store.dispatch = dispatch;
  }

  static get dispatch() {
    return Store.dispatch;
  }

  static set getState(getState) {
    Store.getState = getState;
  }

  static get getState() {
    return Store.getState;
  }
}
