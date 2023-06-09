import * as externalUsersActions from '../constants/ExternalUsers';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { history } from '../History';

export const getExternalUsersStart = () => ({
  type: externalUsersActions.GET_EXTERNAL_USERS_START
});

export const getExternalUsersSuccess = exUsers => ({
  type: externalUsersActions.GET_EXTERNAL_USERS_SUCCESS,
  exUsers
});

export const getExternalUsers = () => {
  const URL = `${API_URL}/user/external`;
  return dispatch => {
    dispatch(getExternalUsersStart());
    dispatch(startLoading());
    axios
      .get(URL)
      .then(
        response => {
          if (response.data) {
            dispatch(getExternalUsersSuccess(response.data));
          }
        },
        error => {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
      )
      .finally(() => dispatch(finishLoading()));
  };
};
export const editExternalUserStart = id => ({
  type: externalUsersActions.EDIT_EXTERNAL_USER_START,
  id
});
export const editExternalUserSuccess = (id, changedUser) => ({
  type: externalUsersActions.EDIT_EXTERNAL_USER_SUCCESS,
  id,
  changedUser
});
export const editExternalUser = (id, changedFields) => {
  const URL = `${API_URL}/user/external/${id}`;
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(editExternalUserStart(id));
      dispatch(startLoading());
      axios
        .put(URL, changedFields)
        .then(
          response => {
            resolve(null);
            if (response.data) {
              dispatch(editExternalUserSuccess(id, response.data));
            }
          },
          error => {
            reject();
            dispatch(showNotification({ message: error.message, type: 'error' }));
          }
        )
        .finally(() => dispatch(finishLoading()));
    });
  };
};
export const addExternalUserStart = () => ({
  type: externalUsersActions.ADD_EXTERNAL_USER_START
});
export const addExternalUserSuccess = exUser => ({
  type: externalUsersActions.ADD_EXTERNAL_USER_SUCCESS,
  exUser
});
export const addExternalUser = exUser => {
  const URL = `${API_URL}/user/external`;
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(addExternalUserStart());
      dispatch(startLoading());
      return axios
        .post(URL, exUser)
        .then(
          response => {
            if (response.data) {
              resolve(response.data);
              dispatch(addExternalUserSuccess(response.data));
            }

            resolve(null);
          },
          error => {
            reject({ message: error.response.data ? error.response.data.message : error.message });
          }
        )
        .finally(() => dispatch(finishLoading()));
    });
  };
};
export const activateExternalUserStart = () => ({
  type: externalUsersActions.ACTIVATE_EXTERNAL_USER_START
});
export const activateExternalUserSuccess = () => ({
  type: externalUsersActions.ACTIVATE_EXTERNAL_USER_SUCCESS
});
export const activateExternalUser = (token, password) => {
  const URL = `${API_URL}/user/password/${token}`;
  return dispatch => {
    dispatch(activateExternalUserStart());
    dispatch(startLoading());
    axios
      .put(URL, {
        password
      })
      .then(
        response => {
          if (response && response.status === 200) {
            dispatch(activateExternalUserSuccess());
            history.push('/login');
          }
        },
        error => {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
      )
      .finally(() => dispatch(finishLoading()));
  };
};
export const deleteExternalUserStart = () => ({
  type: externalUsersActions.DELETE_EXTERNAL_USER_START
});
export const deleteExternalUserSuccess = id => ({
  type: externalUsersActions.DELETE_EXTERNAL_USER_SUCCESS,
  id
});
export const deleteExternalUser = id => {
  const URL = `${API_URL}/user/external/${id}`;
  return dispatch => {
    dispatch(deleteExternalUserStart());
    dispatch(startLoading());
    axios
      .delete(URL)
      .then(
        response => {
          if (response.data) {
            dispatch(deleteExternalUserSuccess(id));
          }
        },
        error => {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
      )
      .finally(() => dispatch(finishLoading()));
  };
};

export const refreshExternalUserLinkStart = () => ({
  type: externalUsersActions.REFRESH_EXTERNAL_USER_LINK_START
});
export const refreshExternalUserLinkSuccess = changedUser => ({
  type: externalUsersActions.REFRESH_EXTERNAL_USER_LINK_SUCCESS,
  changedUser
});
export const refreshExternalUserLink = exUser => {
  const URL = `${API_URL}/user/external/${exUser.id}/refresh`;
  const { ...exUserRU } = exUser;
  return dispatch => {
    dispatch(refreshExternalUserLinkStart());
    dispatch(startLoading());
    axios
      .put(URL, exUserRU)
      .then(
        response => {
          if (response.data) {
            dispatch(refreshExternalUserLinkSuccess(response.data));
          }
        },
        error => {
          dispatch(refreshExternalUserLinkSuccess(exUserRU));
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
      )
      .finally(() => dispatch(finishLoading()));
  };
};
