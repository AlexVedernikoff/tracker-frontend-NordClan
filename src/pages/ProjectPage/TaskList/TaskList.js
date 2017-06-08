import React, { Component } from 'react';

import TaskCard from '../../../components/TaskCard';
import * as css from './TaskList.scss';

//Mocks

const tasks = [];
const getRandomString = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

for (let i = 0; i < 50; i++) {
  tasks.push({
    name: getRandomString([
    'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
    'Back. Голосование, снятие голоса", "UI. Интеграции таба со счетами для страницы пользователя',
    'Киви-Банк - Артек: Ретроспектива 02.06.17',
    'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
    'TASK: Перевод денег из семьи члену семьи',
    'UI. Интеграции таба со счетами для страницы пользователя'
  ]),
    prefix: getRandomString(['MT-12', 'MT-254', 'MT-1245']),
    id: i,
    status: getRandomString(['INHOLD', 'INPROGRESS']),
    stage: getRandomString(['NEW', 'NEW', 'NEW', 'DEVELOP', 'DEVELOP', 'DEVELOP', 'QA', 'CODE_REVIEW', 'QA', 'DONE', 'DONE', 'DONE']),
    executor: getRandomString(['Андрей Юдин', 'Александра Одноклассница', 'Иосиф Джугашвили', 'Ксенофонт Арабский', 'Не назначено']),
    executorId: getRandomString([1, 2, 3, 4, 5]),
    priority: getRandomString([1, 2, 3, 3, 3, 3, 3, 4, 5]),
    plannedTime: getRandomString([8, 9, 10, 11, 12, 13, 14, 15, 16]),
    factTime: getRandomString([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    subtasks: getRandomString([1, 2, 3, 4, 5]),
    linkedTasks: getRandomString([1, 2, 3, 4, 5])
  });
}

let mine = [];
let other = [];


tasks.forEach((element) => {
  if (element.executorId === 2) {
    mine.push(element);
  } else {
    other.push(element);
  }
});

const sortTasks = (sortedArr) => {
  sortedArr.sort((a, b) => {
    if (a.priority > b.priority) return 1;
    if (a.priority < b.priority) return -1;
  });
  return sortedArr.map((element) => {
    return <TaskCard key={element.id} task={element}/>;
  });
};

mine = sortTasks(mine);
other = sortTasks(other);

export default class TaskList extends Component {

  render () {
    return (
      <div>
        <section>
          <h2>Все задачи</h2>
          <h3>Мои</h3>
          {mine}
          <h3>Прочие</h3>
          {other}
        </section>
      </div>
    );
  }
};
