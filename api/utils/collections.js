/**
 * Набор утилит для обмолотки коллекций данных
 * @exports findUnique - поиск уникальных значений заданных ключей
 * @exports conditionalForEach - итератор по массиву, выполняющий некоторое действие с каждым элементом при некотором условии
 */

/**
 * @param {array} arr - массив объектов
 * @param {string[]} - ключ(и) полей объекута, значения которых проверяются на уникальность
 * @returns {object[]} - массив, состоящий из всех уникальных значений в цепочке указанных полей
 */
export function findUnique(arr) {
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
  return findUnique.apply(this, nextArguments);
};

/**
 * Выполняет произвольный код для каждого элемента массива и дополнительного параметра, если они удовлетворяют некоторому условию
 * @param {array} arr - массив, по элементам которого проходит итератор
 * @param {*} second - дополнительный аргумент
 * @param {function} condition
 * - условие (функция от элемента массива и дополнительного аргумента)
 * @param {function} expression
 * - выражение, которое выполняется при выполнении условия (функция от элемента массива и дополнительного аргумента)
 * @returns {*} - первый аргумент (предположительно, массив, если массивом не является, возвращается без изменений)
 */
export function conditionalForEach(arr, second, condition, expression) {
  if (arr instanceof Array) {
    const _condition = proofy(condition);
    const _expression = proofy(expression);
    arr.forEach(first => {
      !!_condition(first, second) && _expression(first, second);
    })
  }
  return arr;
};

/**
 * Обертка-спасжилет над произвольным параметром, всегда возвращает чистую функцию
 * @param {function} func - произвольный параметр (предположительно функция)
 * @returns {function} - "чистая" функция (переданная в качестве параметра, или созданная заглушка, всегда возвращающая true)
 */
const proofy = (func) => {
  return (func && typeof func === 'function') ? func : ()=>true;
}
