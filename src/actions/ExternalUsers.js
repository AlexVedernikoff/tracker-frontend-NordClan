import * as externalUsersActions from '../constants/ExternalUsers';

// export const getExternalUsersStart = () => ({
//   type: externalUsersActions.GET_EXTERNAL_USERS_START
// });

export const getExternalUsersSuccess = () => ({
  type: externalUsersActions.GET_EXTERNAL_USERS_SUCCESS
});

export const getExternalUsers = () => {
  return dispatch => {
    dispatch(getExternalUsersSuccess());
  };
};
export const editExternalUserSuccess = (id, changedFields) => ({
  type: externalUsersActions.EDIT_EXTERNAL_USER_SUCCESS,
  id,
  changedFields
});
export const editExternalUser = (id, changedFields) => {
  return dispatch => {
    dispatch(editExternalUserSuccess(id, changedFields));
  };
};
export const addExternalUserSuccess = exUser => ({
  type: externalUsersActions.ADD_EXTERNAL_USER_SUCCESS,
  exUser
});
export const addExternalUser = exUser => {
  return dispatch => {
    dispatch(addExternalUserSuccess(exUser));
  };
};
export const deleteExternalUserSuccess = id => ({
  type: externalUsersActions.DELETE_EXTERNAL_USER_SUCCESS,
  id
});
export const deleteExternalUser = id => {
  return dispatch => {
    dispatch(deleteExternalUserSuccess(id));
  };
};
