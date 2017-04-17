/**
 * @extends Array
 * Класс-обертка над массивом промисов, заточен под использование с Promise.all
 * @example
 * const queue = new PromiseQueue();
 * queue.add(method1, param1).then(func1);
 * queue.add(method2, param2).then(func2);
 * Promise.all(queue).then(func3);
 */
export default class PromiseQueue extends Array {
  constructor(...args) {
    super(...args);
    /**
     * @method add
     * @param {function} builder - функция, возвращающая Promise
     * @param {...*} [params] - аргументы вызова builder
     * @returns {Promise} - Promise, возвращаемый builder(params)
     * @desc Метод навешивается на экземпляр явном виде, а не методом класса
     * из-за того, что babel не поддерживает расширения нативных классов:
     * @see https://phabricator.babeljs.io/T1424
     * @see https://stackoverflow.com/questions/33832646/extending-built-in-natives-in-es6-with-babel
     */
    this.add = function (builder) { // eslint-disable-line
      const args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line
      const promise = (args.length) ? builder(...args) : builder();
      this.push(promise);
      return promise;
    };
  }
}
