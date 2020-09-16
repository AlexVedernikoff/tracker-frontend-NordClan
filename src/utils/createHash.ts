const createHash = function(...args: any[]) {
  let hash = 0;
  const string = args.join('|');
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export default createHash;
