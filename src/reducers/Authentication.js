import * as AuthActions from '../constants/Authentication';

const InitialState = {
  isAuthSending: false,
  data: {},
  isLogoutSending: false,
  errorMessage: ""
};

function Auth(state = InitialState, action) {
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
        user: action.data,
        isAuthSending: false
      };
    default:
      return state
  }
}

export default Auth;
