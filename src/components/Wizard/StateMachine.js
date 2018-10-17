import { states } from './States.js';

class StateMachine {
  constructor() {
    this.transitions = {
      [states.AUTH]: states.CREATE_PROJECT,
      [states.CREATE_PROJECT]: states.SET_ASSOCIATIONS,
      [states.SET_ASSOCIATIONS]: states.FINISH
    };
  }
  forward(currentPosition) {
    return this.transitions[states[currentPosition]] || currentPosition;
  }
  backward(currentPosition) {
    return Object.keys(this.transitions).find(key => this.transitions[key] === currentPosition) || currentPosition;
  }
}

export default StateMachine;
