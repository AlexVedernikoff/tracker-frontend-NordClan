import * as externalUsersActions from '../constants/ExternalUsers';
import mockEu from '../pages/ExternalUsers/mockEU';
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
        users: mockEu
      };
    case externalUsersActions.EDIT_EXTERNAL_USER_SUCCESS:
      const updatedUsers = state.users.map(user => {
        if (user.id === action.id) {
          return {
            ...user,
            ...action.changedFields
          };
        }
        return user;
      });
      return {
        ...state,
        users: updatedUsers
      };
    default:
      return {
        ...state
      };
  }
}
