const ru = require('convert-layout/ru');

export default function layoutAgnosticFilter(option, filter) {
  const filterValue = filter.toLowerCase().trim();
  const testValue = option.label.toLowerCase().trim();
  if (typeof testValue === 'string') {
    return (
      testValue.indexOf(filterValue) !== -1 ||
      testValue.indexOf(ru.toEn(filterValue)) !== -1 ||
      testValue.indexOf(ru.fromEn(filterValue)) !== -1
    );
  }
  return false;
}
