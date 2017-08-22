export default function GetTypeById (typeId) {
  let type;

  switch (typeId) {
  case 1: type = 'Фича/Задача';
    break;
  case 3: type = 'Доп. Фича';
    break;
  case 2: type = 'Баг';
    break;
  case 4: type = 'Регрес. Баг';
    break;
  default: break;
  }
  return type;
}
