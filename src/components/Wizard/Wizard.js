import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { states } from './States';
import Button from '../Button';
import StateMachine from './StateMachine';

class Wizard extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func
  };

  // wizard result = [{step1data}, {step2data}, {step3data}] - state визарда

  constructor(props) {
    super(props);
    this.state = {
      currentState: states.AUTH,
      result: []
    };
    this.stateMachine = new StateMachine();
  }

  nextStep = () => {
    // запись данных из формы в стейт
    this.setState({
      currentState: this.stateMachine.forward(this.state.currentState)
    });
  };

  previousStep = () => {
    // удаление из объекта даты данных текущего стейта
    this.setState({
      currentState: this.stateMachine.backward(this.state.currentState)
    });
  };

  finalStep = () => {
    // финал со всеми запросами на бэк
  };

  currentStep() {
    switch (this.state.currentState) {
      case states.AUTH:
        return <div>AUTH</div>;
      case states.CREATE_PROJECT:
        return <div>CREATE_PROJECT</div>;
      case states.SET_ASSOCIATIONS:
        return <div>SET_ASSOCIATIONS</div>;
      case states.FINISH:
        return <div>FINISH</div>;
      default:
        return <div>default</div>;
    }
  }

  render() {
    const { lang, isOpen, onRequestClose } = this.props;
    const {} = this.state;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <div className={css.baseForm}>
            <div>{this.currentStep()}</div>
            <Button text="Назад" onClick={this.previousStep} type="green" />
            <Button text="Вперед" onClick={this.nextStep} type="green" />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Wizard;
