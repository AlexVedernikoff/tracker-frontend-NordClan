import * as UsersRolesActions from '../constants/UsersRoles';
import _ from 'lodash';

const InitialState = {
  users: []
};

function Users (state = InitialState, action) {
  switch (action.type) {
  case UsersRolesActions.GET_USERS_START:
    return state;
  case UsersRolesActions.GET_USERS_SUCCESS:
    return {
      ...state,
      users: action.data
    };
  case UsersRolesActions.CHANGE_USER_STATUS_START:
    return state;
  case UsersRolesActions.CHANGE_USER_STATUS_SUCCESS:
    const otherUsers = state.users.filter(user => user.id !== action.user.id);
    const updatedUsers = [...otherUsers, action.user];
    return {
      ...state,
      users: updatedUsers
    };
  default:
    return state;
  }
}

export default Users;
