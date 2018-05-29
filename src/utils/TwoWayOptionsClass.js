class TwoWayOptionsClass {
  constructor(options, legendClassName, optionClassName) {
    const EQUAL = { label: 'Толко', value: 'equalLegend', className: legendClassName, disabled: true };
    const NOT = { label: 'Исключая', value: 'notLegend', className: legendClassName, disabled: true };

    const result = [];

    result.push(EQUAL);
    result.push(...options.map(option => ({ ...option, className: optionClassName })));
    result.push(NOT);
    result.push(
      ...options.map(option => ({
        ...option,
        className: optionClassName,
        value: 'not:' + option.value,
        label: 'Кроме: ' + option.label
      }))
    );

    this.sourceOptions = options;
    this.outputOptions = result;
  }

  get options() {
    return this.outputOptions;
  }

  chechNegativeOption = value => {
    return ('' + value).includes('not:');
  };

  filteredOptions(controlOptionValues) {
    const lastValue = controlOptionValues[controlOptionValues.length - 1];
    const isNegative = this.chechNegativeOption(lastValue);
    return controlOptionValues.filter(value => this.chechNegativeOption(value) === isNegative);
  }

  requestOptions(controlOptionValues) {
    const negativeValues = controlOptionValues
      .filter(value => this.chechNegativeOption(value))
      .map(value => +value.replace('not:', ''));

    const positiveValues = controlOptionValues.filter(value => !this.chechNegativeOption(value));

    const isNegative = !!negativeValues.length;

    const filterOptions = option =>
      isNegative ? !negativeValues.includes(option.value) : positiveValues.includes(option.value);

    return this.sourceOptions.filter(filterOptions).map(option => option.value);
  }
}

export default TwoWayOptionsClass;
