export const getErrorMessageByType = type => {
  switch (type) {
  case 'unique violation':
    return 'Уникальное поле';

  default:
    return 'Произошла ошибка';
  }
};
