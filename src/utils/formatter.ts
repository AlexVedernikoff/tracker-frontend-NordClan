export const removeNumChars = value => value.replace(/[0-9]/g, '');

export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
