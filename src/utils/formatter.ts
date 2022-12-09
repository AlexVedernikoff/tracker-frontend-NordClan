export const removeNumChars = value => value.replace(/[0-9]/g, '');

export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function getObjectKeyByStrRegex<T extends object>(object: T, str: keyof T): (keyof T) | undefined | null {
  if (!object) {
    return null;
  }

  const keys = Object.keys(object);

  return keys.find((key) => {
    const strRegex = new RegExp(key.replace(/[?]/g, '\\?'));

    return strRegex.test(str as string);
  }) as keyof T;
};
