export const getErrorMessageByType = type => {
  switch (type) {
    case 'unique violation':
      return 'Введенный префикс занят. Введите новый префикс для проекта ';

    case 'Validation error':
      return 'Ошибка валидации';

    case 49:
    case 'InvalidCredentialsError':
    case 'NotFoundError':
      return 'Неверный логин/пароль. Проверьте данные';
    case 'GoneError':
      return 'Авторизация невозможна, истек период вашей активности';
    case 'ForbiddenError':
      return 'Пользователь с такими параметрами уже существует';
    default:
      return 'Произошла ошибка';
  }
};
