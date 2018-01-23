import * as UsersRolesActions from '../constants/UsersRoles';
import { GET, PUT, REST_API} from '../constants/RestApi';
import {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  defaultBody as body,
  defaultExtra as extra
} from './Common';


const getUsersStart = () => ({
  type: UsersRolesActions.GET_USERS_START
});

const getUsersSuccess = users => ({
  type: UsersRolesActions.GET_USERS_SUCCESS,
  data: users
});

const getUsers = () => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/user/all',
    method: GET,
    extra,
    start: withStartLoading(getUsersStart, true)(dispatch),
    response: withFinishLoading(response => getUsersSuccess(response.data), true)(dispatch),
    error: defaultErrorHandler(dispatch)
  });
};

export default getUsers;
