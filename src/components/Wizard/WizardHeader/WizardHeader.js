import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { states } from '../states';
import localize from '../states.json';

class Steps extends Component {
  static propTypes = {
    activeStep: PropTypes.string,
    lang: PropTypes.string
  };

  render() {
    const { lang, activeStep } = this.props;
    const stepNodes = Object.keys(states).map(state => {
      console.log(activeStep, state);
      return (
        <div key={state}>
          {localize[lang][state]}
          {state === activeStep ? ' (Текущий шаг)' : null}
        </div>
      );
    });
    return <div>{stepNodes}</div>;
  }
}

export default Steps;
