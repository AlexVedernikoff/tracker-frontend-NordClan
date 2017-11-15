class Validator {
  constructor () {
    this.touched = {};
    this.validatedFields = {};
    this.isDisabled = true;
  }

  handleBlur = (field, hasError) => () => {
    this.touched[field] = true;
    return this.shouldMarkError(field, hasError);
  };

  shouldMarkError = (field, hasError) => {
    return hasError && this.touched[field];
  };

  validate (decorateFunc, field, isError) {
    if (!this.touched[field]) {
      this.touched[field] = false;
    }
    this.validatedFields[field] = isError;
    this.isDisabled = Object.values(this.validatedFields).some(error => error);
    return decorateFunc(
      this.handleBlur(field, isError),
      this.shouldMarkError(field, isError)
    );
  }
}

export default Validator;
