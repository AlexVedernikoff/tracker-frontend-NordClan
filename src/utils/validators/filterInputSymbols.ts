export const invalidSymbolsForNameRuInput = /[^а-яё`-\s]|^[`-\s]/gi;
export const invalidSymbolsForNameEnInput = /[^a-z`-\s]|^[`-\s]/gi;
const simbolsForChange = /[\s`-]{2}/g;

type TStringFunc = (value: string) => string;

const compose = function(fn1: TStringFunc, fn2: TStringFunc) {
  return function(str: string) {
      return fn1(fn2(str));
  };
};

const cutDuplicateSymbol = (match: string) => {
  return match.slice(1);
};

const replaceSymbolsForNameRuInput = (value: string) => {
  return value.replace(invalidSymbolsForNameRuInput, '');
};

const replaceSymbolsForNameEnInput = (value: string) => {
  return value.replace(invalidSymbolsForNameEnInput, '');
};

const replaceDuplicateSymbol = (value: string) => {
  return value.replace(simbolsForChange, cutDuplicateSymbol);
};

export const filterInputNameRuSymbols = compose(replaceDuplicateSymbol, replaceSymbolsForNameRuInput);

export const filterInputNameEnSymbols = compose(replaceDuplicateSymbol, replaceSymbolsForNameEnInput);

