import { isGuide } from '~/guides/utils';
import {
  finishLoading,
  startLoading
} from './Loading';
import {
  showNotification
} from './Notifications';

const withHandler = handler => (callback, shouldBeDispatched = false) => dispatch => (...data) => {
  if (typeof callback === 'function') {
    if (shouldBeDispatched) {
      if (typeof dispatch === 'function') {
        dispatch(callback(...data));
      }
    } else {
      callback(...data);
    }
  }
  if (typeof handler === 'function' && typeof dispatch === 'function') {
    dispatch(handler());
  }
};

const withStartLoading = withHandler(startLoading);

const withFinishLoading = withHandler(finishLoading);

const defaultErrorHandler = withFinishLoading(
  error => {
    if (isGuide()) {
      return;
    }
    showNotification({ message: error.message, type: 'error' });
  },
  true /*shouldBeDispatched*/
);

const defaultExtra = { withCredentials: true };

const withdefaultExtra = (userExtra) => ({
  ...defaultExtra,
  ...userExtra
});

const defaultBody = {};

export {
  defaultErrorHandler,
  withFinishLoading,
  withStartLoading,
  withHandler,
  withdefaultExtra,
  defaultExtra,
  defaultBody
};
