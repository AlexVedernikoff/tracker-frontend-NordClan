import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

export const getOptionsFrom = (arr, labelKey, valueKey) =>
  isArray(arr) ? arr.map(item => ({ label: item[labelKey], value: item[valueKey] })) : [];

export const sortOptionsByLabel = options =>
  options.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    }
  });

export const getValue = option => (isObject(option) ? option.value : option);
