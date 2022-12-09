export const timeReportsGuideVariations = ['to_write_off_time', 'vacation', 'sick_leave', 'time_off', 'work_later'];
export const guideActiveDays = 90;

export const guideTask = [{
    author: {
      fullNameEn: 'Ivan Melkov',
      fullNameRu: 'Иван Мелков'
    },
    id: 1,
    name: 'Обучение',
    prefix: 'study',
    project: {prefix: 'study', name: 'Обучение'},
    projectId: 1109,
    statusId: 1,
    typeId: 1,
    prioritiesId: 5
}];

export const stepAddActivity = [
  {
    target: '.addActivity',
    content: 'Нажми кнопку "Добавить активность"',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const stepActivitiesTable = [
  {
    target: '.activitiesTable',
    content: 'Выбери задачу',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const stepAddProject = [
  {
    target: '.addProject',
    content: 'Нажми добавить',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const stepTaskRow = [
  {
    target: '.taskRow',
    content: 'Выбери день и укажи потраченное время',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];

export const stepToggleComment = [
  {
    target: '.toggleComment',
    content: 'Добавь комментарий - краткое описание того, что ты делал по задаче',
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
    content: 'Каждую пятницу проверяй свои отчеты по времени. Если все в порядке, нажми кнопку Подтвердить',
    styles: {
      options: {
        width: 300,
        height: 300
      }
    }
  }
];


