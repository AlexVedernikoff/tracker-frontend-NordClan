import React from 'react';

export const vacationAddActivity = [
  {
    target: '.addActivity',
    content: 'Нажмите кнопку "Добавить активность"',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const vacationChooseTypeActivity = [
  {
    target: '.activityType',
    content: 'Нажмите и выберите тип активности "Отпуск"',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: 'button[type="submit"]',
    content: 'Нажмите добавить',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const vacationTaskRow = [
  {
    target: '.taskRow',
    content: `
      Заполните часы (каждый день по 8 часов) за период, предшествующий отпуску,
      а также за период отпуска.
    `,
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: 'h1',
    content: (
      <div>
        Обратите внимание:
        <ul style={{ textAlign: 'left' }}>
          <li>Общая продолжительность основного отпуска – 28 календарных дней.</li>
          <li>Отпуск можно делить на части.</li>
          <li>Больничный можно оформить во время отпуска.</li>
          <li>На эти дни отпуск можно продлить или перенести.</li>
          <li>Работодатель вправе отозвать вас из отпуска в случае производственной необходимости.</li>
          <li>Отпуск можно перенести на дни болезни, если его не продлили.</li>
        </ul>
      </div>
    ),
    styles: {
      options: {
        width: 500,
        height: 500
      }
    }
  }
];
