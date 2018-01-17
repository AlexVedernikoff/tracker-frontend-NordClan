export const getErrorMessageByType = type => {
  switch (type) {
  case 'unique violation':
    return 'Введенный префикс занят. Введите новый префикс для проекта ';

  default:
    return 'Произошла ошибка';
  }
};
