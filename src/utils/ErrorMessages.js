export const getErrorMessageByType = type => {
  switch (type) {
  case 'unique violation':
    return 'Введенный префикс занят. Введите новый префикс для проекта ';

  case 49:
  case 'InvalidCredentialsError':
    return 'Неверный логин/пароль. Проверьте данные';

  default:
    return 'Произошла ошибка';
  }
};
