import * as NotificationsActions from '../constants/Notifications';

const AddNotification = notification = ({
  type: NotificationsActions.ADD_NOTIFICATION,
  notification
});

const RemoveNotification = notification = ({
  type: NotificationsActions.REMOVE_NOTIFICATION,
  notification
});
