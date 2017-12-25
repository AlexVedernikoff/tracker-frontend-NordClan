export function formatCurrency (input) {
  let result;

  if (input) {
    result = Number(input);
  } else {
    result = 0;
  }

  return result.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
}
