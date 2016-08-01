/**
 * @exports sequentialComparator - функция-компаратор для последовательного сравнения по нескольким полям
 */

const SORT_ORDER_SIGN = {
  ASC: 1,
  DESC: -1
};

/* eslint-disable id-length*/
/**
 * @param {object} a - сравниваемый объект
 * @param {object} b - сравниваемый объект
 * @param {array} sequence - последовательность применяемых правил сравнения в формате {key: 'propertyName', order: 'asc|desc'}
 * order по-умолчанию - asc (сортировка по возрастанию)
 * @example
 * someArray.sort((item1, item2) => sequentialComparator(item1, item2, [
 *   {key: 'id', order: 'asc'},
 *   {key: 'name', order: 'desc'},
 *   {key: 'price'}
 * ]));
 */
const sequentialComparator = (a, b, sequence) => {
  // TODO: не проще ли будет использовать rest operator?
  if (
    !sequence || !(sequence instanceof Array) || sequence.length === 0
    || (a && typeof a !== 'object') || (b && typeof b !== 'object')
  ) {
    return 0;
  }
  const subsequence = sequence.slice(0);
  const next = subsequence.shift();
  const {key, order = 'ASC'} = next;
  if (typeof a[key] === 'undefined' || typeof b[key] === 'undefined' || !SORT_ORDER_SIGN.hasOwnProperty(order.toUpperCase())) {
    return 0;
  }
  if (a[key] > b[key]) {
    return SORT_ORDER_SIGN[order.toUpperCase()];
  }
  if (a[key] < b[key]) {
    return -1 * SORT_ORDER_SIGN[order.toUpperCase()];
  }
  return sequentialComparator(a, b, subsequence);
};
/* eslint-enable id-length*/

export default sequentialComparator;
