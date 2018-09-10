export const mapFilterFromUrl = (label, value, filter) => {
  console.log('reg', value.test);
  if (label === 'isOnlyMine') {
    return true;
  } else if (Number.isInteger(+value)) {
    return +value;
  } else if (new RegExp('^[-,0-9]+$').test(value)) {
    return value.split(',').map(val => +val);
  } else {
    return null;
  }
};

export const useLocalStorage = false;
export const useSessionStorage = true;
