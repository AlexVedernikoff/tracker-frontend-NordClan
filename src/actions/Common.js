import {
  finishLoading,
  startLoading
} from './Loading';
import {
  showNotification
} from './Notifications';

const withHandler = handler => (callback, shouldBeDispatched) => dispatch => (...data) => {
  if (shouldBeDispatched) {
    dispatch(callback(...data));
  } else {
    callback(...data);
  }
  dispatch(handler());
};

const withStartLoading = withHandler(startLoading);

const withFinishLoading = withHandler(finishLoading);

const defaultErrorHandler = withFinishLoading(
  error => showNotification({ message: error.message, type: 'error' }),
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
