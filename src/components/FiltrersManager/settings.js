const mapFilterFromUrl = (label, value, type) => {
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

const filtersSettings = {
  useLocalStorage: true,
  mapFilterFromUrl: mapFilterFromUrl,
  mapFilterToUrl: false,
  useSessionStorage: false
};

export default filtersSettings;
