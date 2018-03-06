export default function validateNumber(value) {
  const regex = /^$|^\d+(\.\d*)?$/;
  return regex.test(value);
}
