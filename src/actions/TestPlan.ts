import a from '../constants/TestPlan';
import { REST_API, POST } from '../constants/RestApi';
import { defaultErrorHandler, withFinishLoading, withStartLoading, defaultExtra as extra } from './Common';

const createTestPlanStart = () => ({
  type: a.CREATE_TEST_PLAN_START
});

const createTestPlanSuccess = testPlanData => ({
  type: a.CREATE_TEST_PLAN_SUCCESS,
  testPlanData
});

export const createTestPlan = params => {
  return dispatch =>
    dispatch({
      type: REST_API,
      url: '/test-plan',
      method: POST,
      body: params,
      extra,
      start: withStartLoading(createTestPlanStart, true)(dispatch),
      response: withFinishLoading(response => createTestPlanSuccess(response.data), true)(dispatch),
      error: defaultErrorHandler(dispatch)
    });
};
