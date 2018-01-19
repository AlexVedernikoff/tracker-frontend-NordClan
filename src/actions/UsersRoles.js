import * as UsersRolesActions from '../constants/UsersRoles';
import axios from 'axios';
import { API_URL } from '../constants/Settings';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startUsersReceive = () => ({
  type: UsersRolesActions.USERS_RECEIVE_START
});

const UsersReceived = users => ({
  type: UsersRolesActions.USERS_RECEIVE_SUCCESS,
  data: users
});

const getUsers = () => {
  const URL = `${API_URL}/user/all`;
  return dispatch => {
    dispatch(startUsersReceive());
    dispatch(startLoading());
    axios.get(URL, {}, { withCredentials: true })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(UsersReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default getUsers;
