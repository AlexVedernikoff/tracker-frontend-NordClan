import axios from 'axios';
import * as ProjectActions from '../constants/Project';
import { GET, POST, REST_API } from '../constants/RestApi';
import { API_URL } from '../constants/Settings';
import {
  withFinishLoading,
  withStartLoading,
  defaultExtra as extra,
  withdefaultExtra
} from './Common';

const getMetricsRequest = () => ({
  type: ProjectActions.GET_METRICS_REQUEST
});

const getMetricsSuccess = (metrics) => ({
  type: ProjectActions.GET_METRICS_SUCCESS,
  metrics
});

const getMetricsFailure = () => ({
  type: ProjectActions.GET_METRICS_FAILURE
});

export const getMetrics = (data) => {
  return dispatch => dispatch({
    type: REST_API,
    url: '/metrics',
    method: POST,
    body: { ...data },
    extra,
    start: withStartLoading(getMetricsRequest, true)(dispatch),
    response: withFinishLoading(response => {
      dispatch(getMetricsSuccess(response.data));
    })(dispatch),
    error: withFinishLoading(() => {
      dispatch(getMetricsFailure(dispatch));
    })(dispatch)
  });
};

export const calculateMetrics = (projectId) => {
  const URL = `${API_URL}/metrics/${projectId}`;
  axios.get(URL);
};
