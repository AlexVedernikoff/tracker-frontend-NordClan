import * as UsersActions from '../constants/Users';

const InitialState = {
  users: []
};

function Users (state = InitialState, action) {
  switch (action.type) {
  case UsersActions.USERS_RECEIVE_START:
    return {
      ...state
    };
  case UsersActions.USERS_RECEIVE_SUCCESS:
    return {
      ...state,
      users: action.data
    };
  default:
    return state;
  }
}

export default Users;
