class StateMachine {
  constructor(steps) {
    this.steps = steps;
  }

  currentStepIndex = 0;

  getCurrentStep = () => this.steps[this.currentStepIndex];

  createNotExpectedSetError = (expectedStep, factStep) => `Expected ${expectedStep} step but found ${factStep}`;

  checkExpectedStep = (expectedStep, nextStep) => {
    if (expectedStep === nextStep) {
      throw this.createNotExpectedSetError(expectedStep, nextStep);
    }
  };

  getNextStep = (expectedStep = null) => {
    if (this.steps.length - 1 > this.currentStepIndex) {
      const nextStep = this.steps[this.currentStepIndex + 1];
      if (process.env.NODE_ENV === 'development' && expectedStep) {
        this.checkExpectedStep(expectedStep, nextStep);
      }
      this.currentStepIndex++;
      return nextStep;
    }
  };

  getPreviousStep = (expectedStep = null) => {
    if (this.currentStepIndex > 0) {
      const nextStep = this.steps[this.currentStepIndex - 1];
      if (process.env.NODE_ENV === 'development' && expectedStep) {
        this.checkExpectedStep(expectedStep, nextStep);
      }
    }
  };
}

export default StateMachine;
