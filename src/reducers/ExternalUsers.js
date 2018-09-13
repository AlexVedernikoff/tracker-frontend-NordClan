import * as externalUsersActions from '../constants/ExternalUsers';
const InitialState = {
  users: []
};

export default function ExternalUsers(state = InitialState, action) {
  switch (action.type) {
    case externalUsersActions.GET_EXTERNAL_USERS_START:
      return {
        ...state
      };

    case externalUsersActions.GET_EXTERNAL_USERS_SUCCESS:
      return {
        ...state,
        users: action.exUsers
      };
    case externalUsersActions.EDIT_EXTERNAL_USER_SUCCESS:
      const updatedUsers = state.users.map(user => (user.id === action.id ? action.changedUser : user));
      return {
        ...state,
        users: updatedUsers
      };
    case externalUsersActions.REFRESH_EXTERNAL_USER_LINK_SUCCESS:
      const users = state.users.map(user => (user.id === action.id ? action.changedUser : user));
      return {
        ...state,
        users
      };
    case externalUsersActions.ADD_EXTERNAL_USER_SUCCESS:
      const concatedUsers = [action.exUser].concat(state.users);
      return {
        ...state,
        users: concatedUsers
      };
    case externalUsersActions.DELETE_EXTERNAL_USER_SUCCESS:
      const updatedUsersAfterDelete = state.users.filter(user => user.id !== action.id);
      return {
        ...state,
        users: updatedUsersAfterDelete
      };
    default:
      return {
        ...state
      };
  }
}
