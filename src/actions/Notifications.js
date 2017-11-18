import * as NotificationsActions from '../constants/Notifications';
import shortid from 'shortid';

const addNotification = notification => {
  return {
    type: NotificationsActions.ADD_NOTIFICATION,
    notification
  };
};

const removeNotification = notification => ({
  type: NotificationsActions.REMOVE_NOTIFICATION,
  notification
});

const showNotification = notification => {
  return dispatch => {
    notification.id = shortid.generate();
    dispatch(addNotification(notification));

    setTimeout(() => {
      dispatch(removeNotification(notification));
    }, 1500);
  };
};

export { showNotification };
