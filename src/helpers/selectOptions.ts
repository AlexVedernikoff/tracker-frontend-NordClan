import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

export type OptionsFromResult<T> = {label: T, value: T};

export function getOptionsFrom<T, N>(arr: any[], labelKey: T, valueKey: T): OptionsFromResult<N>[]{
  if (isArray(arr)) return []
  return arr.map(item => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
}

export const sortOptionsByLabel = options =>
  options.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    }
  });

export const getValue = option => (isObject(option) ? option.value : option);
