import { Dispatch } from 'redux';
import { GuideStore } from '../../store/reducer';
import { getCurrentSteps, updateCurrentGuide } from '../../utils';
import { GuideStepsNames } from '../types';
import { PluggableGuide } from './types';

class PluggableGuideIterator implements PluggableGuide {
  private dispatch!: Dispatch<GuideStore>;
  private stepNames: GuideStepsNames[] = [];

  constructor(dispatch, stepNames: GuideStepsNames[]) {
    this.dispatch = dispatch;
    this.stepNames = stepNames;
  }

  * start(): Generator<void, void> {
    for (const stepName of this.stepNames) {
      const currentSteps = getCurrentSteps(stepName);

      yield updateCurrentGuide(currentSteps)(this.dispatch);
    }
  }
}

export default PluggableGuideIterator;
