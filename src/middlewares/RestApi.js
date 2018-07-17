import { REST_API, GET, POST, PUT, DELETE } from '../constants/RestApi';
import axios from 'axios';
import { API_URL } from '../constants/Settings';

const allowedMethods = new Set([GET, POST, PUT, DELETE]);
const requiresBody = new Set([PUT, POST]);

const consistantRequest = action => {
  try {
    const { method, body, url } = action;

    if (typeof url !== 'string' || url.length === 0) {
      throw new Error(`url '${url}' is not allowed for rest api`);
    }
    if (!allowedMethods.has(method)) {
      throw new Error(`method '${method}' is not allowed for rest api`);
    }
    if (!body && requiresBody.has(method)) {
      throw new Error(`method '${method}' requires body for rest api`);
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

const polyfill = ({ method, body, extra, start, error, response, url }) => {
  return {
    method,
    body,
    extra,
    start: typeof start === 'function' ? start : () => {},
    response: typeof response === 'function' ? response : () => {},
    error: typeof error === 'function' ? error : () => {},
    url: `${API_URL}${url}`
  };
};

const sendToApi = ({ method, body, extra, start, error, response, url }) => {
  start();
  return axios[method](url, body, extra)
    .then(res => {
      if (res && res.status === 200) {
        response(res);
      } else {
        error({
          response: res || {},
          message: `
            Received ${JSON.stringify(res)} ${res && res.status ? `with status ${res.status}` : ''}
            while ${method.toLocaleUpperCase()} ${url}
            `
        });
        throw res;
      }
    }, error)
    .catch(err => console.error(err));
};

export const restApi = store => next => action => {
  if (action.type !== REST_API) {
    return next(action);
  }

  if (consistantRequest(action)) {
    return sendToApi(polyfill(action));
  }

  return Promise.reject();
};
