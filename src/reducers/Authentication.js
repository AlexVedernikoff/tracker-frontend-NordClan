import * as AuthActions from '../constants/Authentication';

const InitialState = {
  isLoggedIn: false,
  loaded: false,
  defaultRedirectPath: '/projects',
  redirectPath: {},
  user: {
    firstNameRu: '',
    lastNameRu: ''
  }
};

function Auth (state = InitialState, action) {
  switch (action.type) {
  case AuthActions.AUTHENTICATION_START:
    return {
      ...state,
      user: {},
      isLoggedIn: false
    };

  case AuthActions.AUTHENTICATION_ERROR:
    return {
      ...state,
      user: {},
      isLoggedIn: false
    };

  case AuthActions.AUTHENTICATION_RECEIVED:
    return {
      ...state,
      user: action.data,
      isLoggedIn: true
    };

  case AuthActions.LOGOUT_START:
    return {
      ...state
    };

  case AuthActions.LOGOUT_ERROR:
    return {
      ...state
    };

  case AuthActions.LOGOUT_COMPLETE:
    return {
      ...state,
      user: {},
      isLoggedIn: false
    };

  case AuthActions.USER_INFO_RECEIVE_START:
    return {
      ...state,
      user: {},
      isLoggedIn: false
    };

  case AuthActions.USER_INFO_RECEIVE_ERROR:
    return {
      ...state,
      user: {},
      loaded: true,
      isLoggedIn: false
    };

  case AuthActions.USER_INFO_RECEIVE_SUCCESS:
    return {
      ...state,
      user: action.user,
      loaded: true,
      isLoggedIn: true,
      redirectPath: {}
    };

  case AuthActions.SET_REDIRECT_PATH:
    return {
      ...state,
      redirectPath: action.path
    };

  default:
    return state;
  }
}

export default Auth;
