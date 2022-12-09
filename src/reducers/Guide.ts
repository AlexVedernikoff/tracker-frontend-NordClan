import { IGuideStore } from '~/store/store.type';
import * as GuideActions from '../constants/Guide';

const InitialState: IGuideStore = {
  currentSteps: []
};

export default function setStepGuide(state = InitialState, action): IGuideStore {
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
