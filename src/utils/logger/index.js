function log(...rest) {
  console.log(...rest);
}

log.w = (...rest) => console.warn(...rest);
log.e = (...rest) => console.error(...rest);

module.exports = log;
