import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './Steps.scss';

const Steps = props => {
  const { steps, activeStepNumber } = props;
  return (
    <div className={css['steps-container']}>
      {steps.map(step => {
        const isFirstStep = step.stepNumber === 0;
        const isLastStep = step.stepNumber === steps.length - 1;
        const isActiveStep = step.stepNumber === activeStepNumber;
        const isPreviousStep = step.stepNumber < activeStepNumber;
        return (
          <div className={css.step}>
            {isFirstStep ? null : (
              <div
                className={classnames({
                  [css['step-line']]: true,
                  [css['not-lighted-line']]: !isPreviousStep && !isActiveStep,
                  [css['lighted-line']]: isActiveStep || isPreviousStep
                })}
              />
            )}
            <div className={css['step-container']}>
              <div
                className={classnames({
                  [css['circle-step']]: true,
                  [css['active-step']]: isActiveStep
                })}
              >
                {step.stepNumber}
              </div>
              <div className={css['step-content']}>{step.description}</div>
            </div>
            {isLastStep ? null : (
              <div
                className={classnames({
                  [css['step-line']]: true,
                  [css['not-lighted-line']]: !isPreviousStep,
                  [css['lighted-line']]: isPreviousStep
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

Steps.propTypes = {
  activeStepNumber: PropTypes.number,
  steps: PropTypes.array
};

export default Steps;
