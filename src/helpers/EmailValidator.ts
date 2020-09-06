export default value => {
  const re = /\S+@\S+\.\S+/;
  return re.test(value);
};
