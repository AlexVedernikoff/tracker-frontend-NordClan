import * as UsersRolesActions from '../constants/UsersRoles';

const InitialState = {
  users: []
};

function Users (state = InitialState, action) {
  console.log(6, action);
  switch (action.type) {
  case UsersRolesActions.USERS_RECEIVE_START:
    return {
      ...state
    };
  case UsersRolesActions.USERS_RECEIVE_SUCCESS:
    console.log(5, action.data);
    return {
      ...state,
      users: action.data
    };
  default:
    return state;
  }
}

export default Users;
