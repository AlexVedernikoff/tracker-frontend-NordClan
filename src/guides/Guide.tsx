import React, { FC } from 'react';
import { isGuide } from './utils';
import { GuideOwnProps } from './types';
import GuideStepper from './GuideStepper';

const Guide: FC<GuideOwnProps> = (props) => {
  const {
    children,
    shouldRunGuide = isGuide(),
    steps = [],
    renderGuideStepper = () => (
      <GuideStepper
        run={shouldRunGuide}
        callback={() => null}
        steps={steps}
        key={steps.map(({ target }) => target).join('')}
      />
    )
  } = props;

  return (
    <>
      {renderGuideStepper()}
      {children}
    </>
  );
};

export default Guide;
