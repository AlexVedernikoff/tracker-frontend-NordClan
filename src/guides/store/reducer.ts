import { Step } from 'react-joyride';
import * as GuideActions from '../../constants/Guide';

export type GuideStore = {
  currentSteps: Step[];
}

export const InitialState: GuideStore = {
  currentSteps: []
};

export default function guideReducer(state = InitialState, action): GuideStore {
  switch (action.type) {
    case GuideActions.SET_CURRENT_STEPS:
      return {
        currentSteps: action.payload
      };

    default:
      return {
        ...state
      };
  }
}
