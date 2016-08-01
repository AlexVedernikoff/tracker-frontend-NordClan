import sortOrder from './sortOrder';

/**
 * @exports sequentialComparator - функция-компаратор для последовательного сравнения по нескольким полям
 */

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
  const {key} = next;
  const order = sortOrder.sign(next.order);
  if (typeof a[key] === 'undefined' || typeof b[key] === 'undefined' || !order) {
    return 0;
  }
  if (a[key] > b[key]) {
    return order;
  }
  if (a[key] < b[key]) {
    return -1 * order;
  }
  return sequentialComparator(a, b, subsequence);
};
/* eslint-enable id-length*/

export default sequentialComparator;
