export const mapFilterFromUrl = (label, value, filter) => {
  if (label === 'isOnlyMine') {
    return true;
  }

  if (Number.isInteger(+value)) {
    return +value;
  }

  if (new RegExp('^[-,0-9]+$').test(value)) {
    return value.split(',').map(val => +val);
  }

  return null;
};

export const parseTagsQuery = tagsQuery => {
  return tagsQuery ? tagsQuery.split(',').map(value => ({ label: value, value })) : [];
};
