export default value => (value ? +value.toString().replace(/[^\d]/, '') : value);
