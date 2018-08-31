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
  filtersLabel: [
    'prioritiesId',
    'isOnlyMine',
    'performerId',
    'changedSprint',
    'authorId',
    'performerId',
    'typeId',
    'tags'
  ],
  useLocalStorage: true,
  mapFilterFromUrl: mapFilterFromUrl
};

export default filtersSettings;
