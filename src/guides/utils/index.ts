import { GuideNames } from '../index';
import { guides } from '..';
import { setCurrentSteps } from '~/actions/guides';

export const setCurrentGuide = (guideName: GuideNames) => dispatch => {
  const currentGuide = guides[guideName];

  if (!currentGuide) {
    throw new Error('no guide');
  }

  dispatch(setCurrentSteps(currentGuide));
};

export const isGuide = () => {
  return location.href.includes('guide=true');
};

export const isGuideActive = () => {
  return localStorage.getItem('guideActive') === 'true';
};
