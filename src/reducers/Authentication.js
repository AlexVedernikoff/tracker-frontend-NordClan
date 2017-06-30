import * as AuthActions from '../constants/Authentication';

const InitialState = {
  isAuthSending: false,
  isLogoutSending: false,
  errorMessage: ''
};

function Auth (state = InitialState, action) {
  switch (action.type) {
    case AuthActions.AUTHENTICATION_START:
      return {
        ...state,
        isAuthSending: true
      };

    case AuthActions.AUTHENTICATION_ERROR:
      return {
        ...state,
        isAuthSending: false,
        errorMessage: action.errorMessage
      };

    case AuthActions.AUTHENTICATION_RECEIVED:
      return {
        ...state,
        errorMessage: '',
        isAuthSending: false
      };

    case AuthActions.LOGOUT_START:
      return {
        ...state,
        isLogoutSending: true
      };

    case AuthActions.LOGOUT_ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage
      };

    case AuthActions.LOGOUT_COMPLETE:
      return {
        ...state,
        errorMessage: '',
        isLogoutSending: false
      };

    default:
      return state;
  }
}

export default Auth;
