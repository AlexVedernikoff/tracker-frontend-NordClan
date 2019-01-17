import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './Steps.scss';
import Button from '../Button';

const Steps = props => {
  const { steps, activeStepNumber } = props;
  return (
    <div>
      {steps.map(step => {
        const isLastStep = step.stepNumber === steps.length;
        const isActiveStep = step.stepNumber === activeStepNumber;
        const isPreviousStep = step.stepNumber < activeStepNumber;
        return (
          <div className={'steps-container'}>
            <Button
              text={step.labelText}
              className={classnames({
                [css['circle-step']]: true,
                [css['active-step']]: isActiveStep
              })}
            />
            {isLastStep ? null : (
              <hr
                className={classnames({
                  [css['step-line']]: true
                  /*[css['previous-step-line']]: isPreviousStep
                [css['active-step-line']]: isActiveStep,
                [css['next-step-line']]: isPreviousStep*/
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
