import configureStore from 'redux-mock-store';
import { setCurrentSteps } from '../store';
import { getCurrentSteps } from '../utils';
import { vacationAddActivity } from './Timesheets/VacationGuide/constants';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('Test setting guide steps', () => {
  it('should set new steps to store', () => {
    const initialState = {
      currentSteps: []
    };

    const store = mockStore(initialState);
    const steps = getCurrentSteps('vacationAddActivity');

    store.dispatch(setCurrentSteps(steps));

    const actual = store.getActions();
    const expected = [setCurrentSteps(vacationAddActivity)];

    expect(actual).toEqual(expected);
  });
});
