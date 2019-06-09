const ru = require('convert-layout/ru');

export default function layoutAgnosticFilter(option, filter) {
  const filterValue = filter.toLowerCase().trim();
  const testValue = option.label.toLowerCase().trim();
  if (typeof testValue === 'string') {
    return (
      testValue.indexOf(filterValue) === 0 ||
      testValue.indexOf(ru.toEn(filterValue)) === 0 ||
      testValue.indexOf(ru.fromEn(filterValue)) === 0
    );
  }
}
