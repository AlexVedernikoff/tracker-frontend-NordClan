import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

export type OptionsFromResult<T> = {label: T, value: T};

export function getOptionsFrom<T, N>(arr: any[], labelKey: T, valueKey: T): OptionsFromResult<N>[]{
  if (!isArray(arr)) return []
  return arr.map(item => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
}

export function sortOptionsByLabel<T extends {label: any}> (options: T[]): T[] {
  return options.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    }
    return 0;
  })
};

export function getValue(option: any) : any {
  return isObject(option) ? option.value : option
};
