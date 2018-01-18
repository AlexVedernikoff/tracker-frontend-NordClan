import * as UsersRolesActions from '../constants/UsersRoles';

const InitialState = {
  users: []
};

function Users (state = InitialState, action) {
  switch (action.type) {
  case UsersRolesActions.USERS_RECEIVE_START:
    return {
      ...state
    };
  case UsersRolesActions.USERS_RECEIVE_SUCCESS:
    return {
      ...state,
      users: action.data
    };
  default:
    return state;
  }
}

export default Users;
