export const invalidSymbolsForNameRuInput = /[^а-яА-ЯёЁ`-\s]|^[`-\s]/gi;
export const invalidSymbolsForNameEnInput = /[^a-zA-Z`-\s]|^[`-\s]/gi;
const duplicateSymbolsRegex = /[\s`-]{2}/g;

export const replaceSymbolsForNameRuInput = (value: string) => {
  return value.replace(invalidSymbolsForNameRuInput, '');
};

export const replaceSymbolsForNameEnInput = (value: string) => {
  return value.replace(invalidSymbolsForNameEnInput, '');
};

export const replaceDuplicateSymbol = (value: string) => {
  return value.replace(duplicateSymbolsRegex, (match) => match.slice(1));
};

