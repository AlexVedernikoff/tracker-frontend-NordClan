export const firstTruthyOrZero = (...args) => {
  // returns first truthy or zero argument
  for (const arg of args) {
    if (arg || arg === 0) return arg;
  }
  return args[args.length - 1];
};
