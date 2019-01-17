import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Steps from '../../Steps';
import localize from '../states.json';

class StepsHeader extends Component {
  static propTypes = {
    activeStep: PropTypes.string,
    jiraSteps: PropTypes.array,
    lang: PropTypes.string
  };

  render() {
    const { lang, activeStep, jiraSteps } = this.props;
    const steps = jiraSteps.map((step, index) => ({
      stepNumber: index,
      description: localize[lang][step]
    }));
    return <Steps activeStepNumber={jiraSteps.indexOf(activeStep)} steps={steps} />;
  }
}

export default StepsHeader;
