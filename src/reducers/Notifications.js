import * as NotificationsActions from '../constants/Notifications';

const InitialState = {
  Notifications: []
};

function Notifications (state = InitialState, action) {
  switch (action.type) {
  case NotificationsActions.ADD_NOTIFICATION:
    return {
      Notifications: [...state.Notifications, action.notification]
    };

  case NotificationsActions.REMOVE_NOTIFICATION:
    return {
      Notifications: state.Notifications.filter(
            notification => notification.id !== action.notification.id
          )
    };

  default:
    return {
      ...state
    };
  }
}

export default Notifications;
