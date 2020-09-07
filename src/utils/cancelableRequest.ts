import axios from 'axios';

const calls = {};

const makeRequest = (config = {}, onStart = () => {}) => {
  const call = calls[config.url];

  if (call) {
    call.cancel('Only one request allowed at a time.');
  }

  onStart();

  calls[config.url] = axios.CancelToken.source();
  config.cancelToken = calls[config.url].token;

  return axios(config);
};

export const createCancelableRequest = (dispatch, configGenerator) => {
  const { reqConfig, onStart, onError, onSuccess, onFinishLoading } = configGenerator(dispatch);

  return makeRequest(reqConfig, onStart)
    .then(onSuccess)
    .catch(error => {
      if (axios.isCancel(error)) {
        onFinishLoading();
      } else {
        onError(error);
      }
    });
};
