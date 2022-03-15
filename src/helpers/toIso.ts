type ToISO = (raw: string) => string;

export const toIso: ToISO = (raw) => {
  if (!raw) {
    return raw;
  }
  const date = new Date(raw);

  const isInvalidDate = isNaN(date.getTime());
  if (isInvalidDate) {
    return raw;
  }

  return `${getTwoDigit(date.getDate())}.${getTwoDigit(date.getMonth() + 1)}.${date.getFullYear()}`;
};

function getTwoDigit(number: number): string | number {
  return number < 10 ? `0${number}` : number;
}
