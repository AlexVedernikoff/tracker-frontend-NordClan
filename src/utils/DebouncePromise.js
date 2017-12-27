/**
 * forked from https://github.com/bjoerge/debounce-promise
 * @param fn
 * @param wait
 * @returns {function(...[*]=)}
 */
module.exports = (fn, wait = 0) => {
  let deferred;
  let timer;
  let pendingArgs = [];
  return (...args) => {
    const currentWait = getWait(wait);

    if (deferred) {
      clearTimeout(timer);
    } else {
      deferred = defer();
    }

    pendingArgs.push(args);
    timer = setTimeout(flush.bind(this), currentWait);

    return deferred.promise;
  };

  function flush () {
    const thisDeferred = deferred;
    clearTimeout(timer);

    fn.apply(this, pendingArgs[pendingArgs.length - 1])
      .then(res => thisDeferred.resolve(res), err => thisDeferred.reject(err));

    pendingArgs = [];
    deferred = null;
  }
};

function getWait (wait) {
  return (typeof wait === 'function') ? wait() : wait;
}

function defer () {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
