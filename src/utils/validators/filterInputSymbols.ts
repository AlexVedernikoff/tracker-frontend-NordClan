export const invalidSymbolsForNameRuInput = /[^а-яё`-\s]/gi;
export const invalidSymbolsForNameEnInput = /[^a-z`-\s]/gi;

export const filterInputSymbols = (value: string, regexp) => {
  let newValue;
  newValue = value.replace(/^[`-\s]/, '');
  newValue = newValue.replace(/ {2}/, ' ');
  newValue = newValue.replace(/`{2}/, '`');
  newValue = newValue.replace(/-{2}/, '-');
  newValue = newValue.replace(regexp, '');
  return newValue;
}

