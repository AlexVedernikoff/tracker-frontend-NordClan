import { IUserListStore } from '~/store/store.type';
import {
  GET_ALL_USERS_SUCCESS,
  GET_DEV_OPS_USERS_SUCCESS,
  GET_USER_STATUS_SUCCESS,
  PURGE_USER
} from '../constants/UsersAction';

const initialState: IUserListStore = {
  devOpsUsers: null,
  users: null,
  user: null
};

export default function UserList(state = initialState, action): IUserListStore {
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
    case GET_USER_STATUS_SUCCESS: {
      return {
        ...state,
        user: action.user
      };
    }
    case PURGE_USER:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
