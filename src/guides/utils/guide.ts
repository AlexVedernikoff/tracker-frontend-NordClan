import { setCurrentSteps } from '../store';
import { guidesHashes } from '../constants';
import { Step } from 'react-joyride';
import { guideSteps } from '../domain/constants';
import { GuideStepsNames } from '../domain/types';

export const getCurrentSteps = (guideName: GuideStepsNames) => {
  const currentSteps = guideSteps[guideName];

  if (!currentSteps) {
    throw new Error('no guide steps found');
  }

  return currentSteps;
};

export const updateCurrentGuide = (steps: Step[]) => dispatch => {
  dispatch(setCurrentSteps(steps));
};

export const isGuide = () => {
  return guidesHashes.some((guideHash) => window.location.hash.includes(guideHash));
};

export const isGuideActive = () => {
  return localStorage.getItem('guideActive') === 'true';
};

export const toggleGuideActivation = (isActive: boolean) => {
  localStorage.setItem('guideActive', isActive.toString());
};
