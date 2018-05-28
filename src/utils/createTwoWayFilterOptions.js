const getTwoWayOptions = (options, legendClassName, optionClassName) => {
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

  return result;
};

export default getTwoWayOptions;
