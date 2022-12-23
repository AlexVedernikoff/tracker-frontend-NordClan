import { ReactNode } from 'react';
import { Step } from 'react-joyride';
import { PluggableGuide } from './domain/PluggableGuide/types';

export type GuideOwnProps = {
  shouldRunGuide?: boolean;
  steps: Step[];
  guide: PluggableGuide;

  /**
   * @description рендер-функция для компонента показа шагов
   */
  renderGuideStepper?: () => ReactNode;
}

export type GuideContainerProps = {
  getGuideIterator: () => PluggableGuide;
}

export type GuideProps = GuideOwnProps & GuideContainerProps;
