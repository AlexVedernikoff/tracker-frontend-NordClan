const filterTypes = {
  array: 'isArray',
  number: 'isNumber',
  boolean: 'isBool',
  string: 'isString'
};

export const typeCheck = {
  [filterTypes.string]: val => typeof val === 'string' || val instanceof String,
  [filterTypes.number]: val => typeof val === 'number' && isFinite(val),
  [filterTypes.boolean]: val => typeof val === 'boolean',
  [filterTypes.array]: val => val && typeof val === 'object' && val.constructor === Array
};

export const filterTypeCheck = filter => {
  let valid = true;
  if (filter && filter.type && typeCheck[filter.type]) {
    if (filter.type === filterTypes.array) {
      if (filter.itemType) {
        if (filter.value) {
          filter.value.forEach(item => {
            if (!typeCheck[filter.itemType](item)) {
              valid = false;
            }
          });
        }
      } else {
        valid = false;
      }
    } else if (filter.value || filter.value === 0 || filter.value === false || filter.value === '') {
      valid = typeCheck[filter.type](filter.value);
    }
  } else {
    valid = false;
  }
  return valid;
};

export default filterTypes;
