import types from '../constants/ActionTypes';

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [types.LOAD, types.LOAD_SUCCESS, types.LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(name) {
  return {
    types: [types.LOGIN, types.LOGIN_SUCCESS, types.LOGIN_FAIL],
    promise: (client) => client.post('/login', {
      data: {
        name: name
      }
    })
  };
}

export function logout() {
  return {
    types: [types.LOGOUT, types.LOGOUT_SUCCESS, types.LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}