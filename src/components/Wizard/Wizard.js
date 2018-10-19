import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { states } from './States';
import Button from '../Button';
import StateMachine from './StateMachine';

import Auth from './steps/auth/Auth';
class Wizard extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    jiraAuthorize: PropTypes.func,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func
  };

  // wizard result = [{step1data}, {step2data}, {step3data}] - state визарда

  constructor(props) {
    super(props);
    this.state = {
      currentState: states.AUTH
    };
    this.stateMachine = new StateMachine();
  }

  nextStep = formData => {
    this.props.jiraAuthorize(formData).then(res => {
      const { token } = res;
      if (token) {
        this.setState({
          currentState: this.stateMachine.forward(this.state.currentState)
        });
      }
    });
  };

  previousStep = () => {
    this.state.result.pop();
    this.setState({
      currentState: this.stateMachine.backward(this.state.currentState)
    });
  };

  finalStep = () => {
    // финал со всеми запросами на бэк
  };

  currentStep(lang) {
    switch (this.state.currentState) {
      case states.AUTH:
        return (
          <div>
            <Auth lang={lang} previousStep={this.previousStep} nextStep={this.nextStep} />
          </div>
        );
      case states.CREATE_PROJECT:
        return (
          <div>
            <div>CREATE_PROJECT</div>
            <Button text="Назад" onClick={this.previousStep} type="green" />
            <Button text="Вперед" onClick={this.nextStep} type="green" />
          </div>
        );
      case states.SET_ASSOCIATIONS:
        return (
          <div>
            <div>SET_ASSOCIATIONS</div>
            <Button text="Назад" onClick={this.previousStep} type="green" />
            <Button text="Вперед" onClick={this.nextStep} type="green" />
          </div>
        );
      case states.FINISH:
        return (
          <div>
            <div>FINISH</div>
            <Button text="Назад" onClick={this.previousStep} type="green" />
            <Button text="Вперед" onClick={this.nextStep} type="green" />
          </div>
        );
      default:
        return (
          <div>
            <div>default</div>
            <Button text="Назад" onClick={this.previousStep} type="green" />
            <Button text="Вперед" onClick={this.nextStep} type="green" />
          </div>
        );
    }
  }

  render() {
    const { lang, isOpen, onRequestClose } = this.props;
    const {} = this.state;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <div className={css.baseForm}>
            <div>{this.currentStep(lang)}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Wizard;
