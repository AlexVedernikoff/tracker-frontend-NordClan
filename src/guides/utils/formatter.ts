/**
 * @description Функция получения ключа объекта по регулярному выражению
 */
export function getObjectKeyByStrRegex<T extends object>(object: T, str: keyof T): (keyof T) | undefined | null {
  if (!object) {
    return null;
  }

  const keys = Object.keys(object);

  return keys.find((key) => {
    const strRegex = new RegExp(key.replace(/[?]/g, '\\?'));

    return strRegex.test(str as string);
  }) as keyof T;
}
