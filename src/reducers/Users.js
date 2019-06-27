import { GET_ALL_USERS_SUCCESS, GET_DEV_OPS_USERS_SUCCESS } from '../constants/UsersAction';

const initialState = {
  devOpsUsers: null,
  users: null
};

export default function UserList(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: action.data
      };
    case GET_DEV_OPS_USERS_SUCCESS:
      return {
        ...state,
        devOpsUsers: action.data
      };
    default:
      return state;
  }
}
