export const mapFilterFromUrl = (label, value) => {
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

export const mapFilterToUrl = (filter, key) => {
  let value = filter;

  if (Array.isArray(filter)) {
    if (filter.every(el => typeof el === 'object')) {
      value = filter.map(el => el.value);
    }

    return `${key}[]=${value}`;
  }

  if (typeof filter === 'object') {
    return `${key}=${JSON.stringify(value)}`;
  }

  return `${key}=${value}`;
};

export const parseTagsQuery = tagsQuery => {
  return tagsQuery ? tagsQuery.split(',').map(value => ({ label: value, value })) : [];
};
