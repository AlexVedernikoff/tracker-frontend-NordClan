import * as AuthActions from '../constants/Authentication';

const InitialState = {
  isLoggedIn: false,
  user: {
    firstNameRu: "",
    lastNameRu: ""
  }
};

function Auth (state = InitialState, action) {
  switch (action.type) {
    case AuthActions.AUTHENTICATION_START:
      return {
        ...state
      };

    case AuthActions.AUTHENTICATION_ERROR:
      return {
        ...state
      };

    case AuthActions.AUTHENTICATION_RECEIVED:
      return {
        ...state
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
        ...state
      };

    case AuthActions.USER_INFO_RECEIVE_START:
      return {
        ...state
      };

    case AuthActions.USER_INFO_RECEIVE_ERROR:
      return {
        ...state,
        user: {}
      };

    case AuthActions.USER_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
        user: action.user,
        isLoggedIn: true
      };


    default:
      return state;
  }
}

export default Auth;
