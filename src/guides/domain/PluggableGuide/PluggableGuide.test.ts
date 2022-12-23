/* eslint-disable no-undef */
import configureStore from 'redux-mock-store';
import { setCurrentSteps } from '../../store';
import { GuideStepsNames } from '../types';

import PluggableGuide from './PluggableGuide';

const middlewares = [];
const mockStore = configureStore(middlewares);

const steps1 = [
  {
    content: 'step 1'
  }
];

const steps2 = [
  {
    content: 'step 2'
  }
];

jest.mock('../../utils', () => {
  const originalModule = jest.requireActual('../../utils');

  return {
    __esModule: true,
    ...originalModule,
    getCurrentSteps: jest.fn()
      .mockImplementationOnce(() => steps1)
      .mockImplementationOnce(() => steps2)
  };
});

describe('Test PluggableGuide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch steps to store in iteration', () => {
    const initialState = {
      currentSteps: []
    };

    const store = mockStore(initialState);
    const steps = [
      'steps 1',
      'steps 2'
    ] as unknown as GuideStepsNames[];

    const guide = new PluggableGuide(store.dispatch, steps);

    const guideSteps = guide.start();

    guideSteps.next();
    guideSteps.next();

    const actual = store.getActions();
    const expected = [
      setCurrentSteps(steps1),
      setCurrentSteps(steps2)
    ];

    expect(actual).toEqual(expected);
  });
});
