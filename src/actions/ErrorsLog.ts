import axios from 'axios';
import { API_URL } from '../constants/Settings';
import { showNotification } from './Notifications';

export const sendError = data => {
    const URL = `${API_URL}/errors_log`;
    return dispatch => {
      axios
        .post(URL, data)
        .catch(error => {
          dispatch(showNotification({ message: error.message, type: 'error' }));
          throw error;
        });
    };
  };

