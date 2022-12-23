import { SET_CURRENT_STEPS } from './constants';

export const setCurrentSteps = payload => ({
  type: SET_CURRENT_STEPS,
  payload
}) as const;
