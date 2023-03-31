export const invalidSymbolsForNameRuInput = /[^а-яё`-\s]|^[`-\s]/gi;
export const invalidSymbolsForNameEnInput = /[^a-z`-\s]|^[`-\s]/gi;
const simbolsForChange = /[\s`-]{2}/g;

const cutDuplicateSymbol = (match: string) => {
  return match.slice(1);
};

export const replaceSymbolsForNameRuInput = (value: string) => {
  return value.replace(invalidSymbolsForNameRuInput, '');
};

export const replaceSymbolsForNameEnInput = (value: string) => {
  return value.replace(invalidSymbolsForNameEnInput, '');
};

export const replaceDuplicateSymbol = (value: string) => {
  return value.replace(simbolsForChange, cutDuplicateSymbol);
};

