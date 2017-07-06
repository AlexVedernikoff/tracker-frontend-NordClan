import * as NotificationsActions from '../constants/Notifications';

const AddNotification = notification => {
  return {
    type: NotificationsActions.ADD_NOTIFICATION,
    notification
  };
};

const RemoveNotification = notification => ({
  type: NotificationsActions.REMOVE_NOTIFICATION,
  notification
});

const ShowNotification = notification => {
  return dispatch => {
    dispatch(AddNotification(notification));

    setTimeout(() => {
      dispatch(RemoveNotification(notification))
    }, 1500)
  }
}

export { ShowNotification };
