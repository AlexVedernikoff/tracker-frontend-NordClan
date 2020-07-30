class Validator {
  touched: { [name: string]: boolean }
  validatedFields: { [name: string]: boolean }
  isDisabled: boolean

  constructor() {
    this.touched = {}
    this.validatedFields = {}
    this.isDisabled = true
  }

  handleBlur = (field: string, hasError: boolean) => () => {
    this.touched[field] = true
    return this.shouldMarkError(field, hasError)
  };

  shouldMarkError = (field: string, hasError: boolean) => {
    return hasError && this.touched[field]
  };

  resetTouched = () => {
    this.touched = {}
  };

  validate(decorateFunc: (handleBlur: Function, shouldMarkError: boolean) => any, field: string, isError: boolean) {
    if (!this.touched[field]) {
      this.touched[field] = false
    }
    this.validatedFields[field] = isError
    this.isDisabled = Object.values(this.validatedFields).some(error => error)
    return decorateFunc(this.handleBlur(field, isError), this.shouldMarkError(field, isError))
  }
}

export default Validator
