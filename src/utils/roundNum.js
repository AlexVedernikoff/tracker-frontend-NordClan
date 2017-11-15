export default function roundNum (num, count) {
  const exponent = Math.pow(10, count);
  return Math.round(num * exponent) / exponent;
}
