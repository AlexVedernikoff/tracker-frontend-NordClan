/**
 * Набор утилит для обмолотки коллекций данных
 * @exports findUniques - поиск уникальных значений заданных ключей
 */

/**
 * @param {array} arr - массив объектов
 * @param {string[]} - ключ(и) полей объекута, значения которых проверяются на уникальность
 * @returns {object[]} - массив, состоящий из всех уникальных значений в цепочке указанных полей
 */
export function findUniques(arr) {
  if (!(arr instanceof Array) || (typeof arguments[1] !== 'string')) {
    return arr;
  }
  let nextArguments = Array.prototype.slice.call(arguments, 0);
  const key = nextArguments.splice(1, 1)[0];
  try {
    nextArguments[0] = arr.map(item => (item[key])).filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  } catch (err) {
    console.log(err);
    return arr;
  }
  return findUniques.apply(this, nextArguments);
};
