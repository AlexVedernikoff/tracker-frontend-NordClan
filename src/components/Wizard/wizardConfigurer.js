function Step(stepNumber, steps) {
  this.steps = steps;
  this.stepNumber = stepNumber;
  if (this.stepNumber !== 0) {
    this.backwardStep = () => {
      return this.steps[stepNumber - 1];
    };
  }
  if (this.stepNumber < steps.length - 1) {
    this.forwardStep = () => {
      return this.steps[stepNumber + 1];
    };
  }
}

const createStepsManager = (steps, currentStepIndex = 0) => {
  const wizardStepStates = {};
  steps.forEach((step, index) => {
    wizardStepStates[step] = new Step(index, steps);
  });
  return {
    ...wizardStepStates,
    currentStep: steps[currentStepIndex]
  };
};

export { createStepsManager };
