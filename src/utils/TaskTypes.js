export default function GetTypeById (typeId) {
    let type;

    switch (typeId) {
        case 1: type = 'Фича/Задача';
                break;
        case 2: type = 'Баг';
                break;
        case 3: type = 'Анализ';
                break;
        case 4: type = 'Дизайн';
                break;
        case 5: type = 'Управление';
                break;
        case 6: type = 'Митинг';
                break;
        case 7: type = 'Конфигурация';
                break;
        default: break;
    }
    return type;
}
