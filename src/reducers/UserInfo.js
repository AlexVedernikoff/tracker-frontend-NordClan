import * as UserInfoActions from '../constants/UserInfo';

const InitialState = {
  isReceiving: false,
  isLoggedIn: false,
  user: {}
};

function UserInfo(state = InitialState, action) {
  switch (action.type) {
    case UserInfoActions.USER_INFO_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case UserInfoActions.USER_INFO_RECEIVE_ERROR:
      return {
        ...state,
        isReceiving: false,
        user: {}
      };

    case UserInfoActions.USER_INFO_RECEIVE_SUCCESS:
      return {
        ...state,
        isReceiving: false,
        user: action.user,
        isLoggedIn: true
      };

    default:
      return state;
  }
}

export default UserInfo;
