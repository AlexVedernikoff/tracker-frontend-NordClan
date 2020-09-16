function Step(stepNumber: number, steps: any[]) {
  // @ts-expect-error
  const _this = (this as any);

  _this.steps = steps;
  _this.stepNumber = stepNumber;
  if (_this.stepNumber !== 0) {
    _this.backwardStep = () => {
      return _this.steps[stepNumber - 1];
    };
  }
  if (_this.stepNumber < steps.length - 1) {
    _this.forwardStep = () => {
      return _this.steps[stepNumber + 1];
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
