import React from 'react';

export const writeOffAddActivity = [
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

export const writeOffActivitiesTable = [
  {
    target: '.activitiesTable',
    content: 'Выберите задачу',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: '.addProject',
    content: 'Нажмите добавить',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const writeOffTaskRow = [
  {
    target: '.taskRow',
    content: 'Выберите день и укажите потраченное время',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: '.toggleComment',
    content: 'Добавьте комментарий - краткое описание того, что вы делали по задаче',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: '.totalToggleComment',
    content: 'Добавлять комментарий к задачам можно здесь',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  },
  {
    target: '.submit',
    content: (
      <div>
        В конце рабочей недели проверьте отчеты по времени (должно быть по 8 часов на день)
        и нажмите кнопку Подвердить.
      </div>
    ),
    styles: {
      options: {
        width: 400,
        height: 400
      }
    }
  }
];
