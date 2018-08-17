export default value => {
  const parseIntValue = parseInt(value, 10);
  return isNaN(parseIntValue) ? 0 : parseIntValue;
};
