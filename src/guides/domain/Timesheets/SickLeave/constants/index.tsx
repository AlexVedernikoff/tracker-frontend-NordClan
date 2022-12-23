import React from 'react';

export const sickLeaveAddActivity = [
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

export const sickLeaveTypeActivity = [
  {
    target: '.activityType',
    content: 'Нажмите и выберите тип активности "Больничный"',
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

export const sickLeaveTaskRow = [
  {
    target: '.taskRow',
    content: `
      Заполните часы (каждый день по 8 часов) за период больничного
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
          <li>Больничный лист выписывают на срок до 15 календарных дней.</li>
          <li>Если болеете дольше 15 календарных дней, врачебная комиссия может продлить срок больничного.</li>
          <li>Для оформления пособия нужен лист нетрудоспособности или номер электронного больничного</li>
          <li>Пособие за первые 3 дня платит работодатель, далее платит ФСС</li>
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
