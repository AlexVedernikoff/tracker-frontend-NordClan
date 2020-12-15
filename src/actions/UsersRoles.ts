import * as UsersRolesActions from '../constants/UsersRoles';
import { GET, PUT, REST_API, PATCH } from '../constants/RestApi';
import { defaultErrorHandler, withFinishLoading, withStartLoading, defaultExtra as extra } from './Common';

const getUsersStart = () => ({
  type: UsersRolesActions.GET_USERS_START
});

const getUsersSuccess = users => ({
  type: UsersRolesActions.GET_USERS_SUCCESS,
  data: users
});

const changeUserStatusStart = () => ({
  type: UsersRolesActions.CHANGE_USER_STATUS_START
});

const changeUserStatusSuccess = user => ({
  type: UsersRolesActions.CHANGE_USER_STATUS_SUCCESS,
  user
});

export const getUsers = status => {
  const stat = status !== undefined ? status : true;
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/user/roles?status=' + stat,
      method: GET,
      body: {
        status: stat
      },
      extra,
      start: withStartLoading(getUsersStart, true)(dispatch),
      response: withFinishLoading(response => getUsersSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const updateUserRole = user => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/user/',
      method: PUT,
      body: user,
      extra,
      start: withStartLoading(changeUserStatusStart, true)(dispatch),
      response: withFinishLoading(response => changeUserStatusSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const updateUserProfilePut = user => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/user/update-profile',
      method: PUT,
      body: user,
      extra,
      start: withStartLoading(changeUserStatusStart, true)(dispatch),
      response: withFinishLoading(response => changeUserStatusSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};

export const updateUserProfilePatch = user => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/user/update-profile',
      method: PATCH,
      body: user,
      extra,
      start: withStartLoading(changeUserStatusStart, true)(dispatch),
      response: withFinishLoading(response => changeUserStatusSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};