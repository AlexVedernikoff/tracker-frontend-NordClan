import { states } from './States.js';

import { associationStates } from './steps/SetAssociation/AssociationStates';

class StateMachine {
  constructor() {
    this.transitions = {
      [states.AUTH]: states.CREATE_PROJECT,
      [states.CREATE_PROJECT]: states.SET_ASSOCIATIONS,
      [states.SET_ASSOCIATIONS]: states.FINISH
    };

    this.associationTransitions = {
      [associationStates.ISSUE_TYPES]: associationStates.STATUS_TYPES,
      [associationStates.STATUS_TYPES]: associationStates.USERS
    };
  }
  forward(currentPosition) {
    return this.transitions[states[currentPosition]] || currentPosition;
  }
  backward(currentPosition) {
    return Object.keys(this.transitions).find(key => this.transitions[key] === currentPosition) || currentPosition;
  }

  nextAssociation(currentPosition) {
    return this.associationTransitions[associationStates[currentPosition]] || currentPosition;
  }
  prevoiusAssociation(currentPosition) {
    return (
      Object.keys(this.associationTransitions).find(key => this.associationTransitions[key] === currentPosition) ||
      currentPosition
    );
  }
}

export default StateMachine;
