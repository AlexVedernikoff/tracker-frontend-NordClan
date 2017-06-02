import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import TaskCard from '../../../components/TaskCard';
import * as css from './AgileBoard.scss';

export default class AgileBoard extends Component {
  static propTypes = {
  }

  render () {

    //Mocks

    // Template for json generator

    // [
    //   '{{repeat(50, 50)}}',
    //   {
    //     name: '{{random("Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара", "Back. Голосование, снятие голоса", "UI. Интеграции таба со счетами для страницы пользователя", "Киви-Банк - Артек: Ретроспектива 02.06.17", "Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара", "TASK: Перевод денег из семьи члену семьи")}}',
    //     id: '{{index(0)}}',
    //     status: '{{random("INHOLD", "INPROGRESS")}}',
    //     stage: '{{random("NEW", "DEVELOP", "QA", "CODE_REVIEW", "QA", "DONE")}}',
    //     executor: '{{firstName()}} {{surname()}}',
    //     executorId: '{{integer(0, 5)}}',
    //     priority: '{{integer(1, 5)}}',
    //     plannedTime: '{{integer(0, 24)}}',
    //     factTime: '{{integer(0, 30)}}',
    //     subtasks: '{{integer(0, 5)}}'
    //   }
    // ]

    const sprint = {
      id: 123,
      name: 'Спринт №1',
      dateStart: '01.06.2017',
      dateEnd: '30.06.2017',
      status: 'active',
      tasks: [
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 0,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Willie Preston',
          'executorId': 4,
          'priority': 4,
          'plannedTime': 23,
          'factTime': 30,
          'subtasks': 1
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 1,
          'status': 'INPROGRESS',
          'stage': 'CODE_REVIEW',
          'executor': 'Glass Duran',
          'executorId': 3,
          'priority': 3,
          'plannedTime': 7,
          'factTime': 21,
          'subtasks': 2
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 2,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Olson Pratt',
          'executorId': 4,
          'priority': 2,
          'plannedTime': 3,
          'factTime': 9,
          'subtasks': 4
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 3,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Nicholson Dejesus',
          'executorId': 5,
          'priority': 5,
          'plannedTime': 2,
          'factTime': 19,
          'subtasks': 3
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 4,
          'status': 'INHOLD',
          'stage': 'DEVELOP',
          'executor': 'Baker Cervantes',
          'executorId': 0,
          'priority': 5,
          'plannedTime': 6,
          'factTime': 6,
          'subtasks': 0
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 5,
          'status': 'INHOLD',
          'stage': 'DONE',
          'executor': 'Graves Gallegos',
          'executorId': 1,
          'priority': 1,
          'plannedTime': 2,
          'factTime': 22,
          'subtasks': 5
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 6,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Workman Gordon',
          'executorId': 0,
          'priority': 4,
          'plannedTime': 22,
          'factTime': 2,
          'subtasks': 4
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 7,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Teresa Gomez',
          'executorId': 0,
          'priority': 5,
          'plannedTime': 17,
          'factTime': 23,
          'subtasks': 2
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 8,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Sheena Hyde',
          'executorId': 4,
          'priority': 5,
          'plannedTime': 9,
          'factTime': 12,
          'subtasks': 4
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 9,
          'status': 'INHOLD',
          'stage': 'DONE',
          'executor': 'Ochoa Glass',
          'executorId': 5,
          'priority': 1,
          'plannedTime': 24,
          'factTime': 23,
          'subtasks': 3
        },
        {
          'name': 'Back. Голосование, снятие голоса',
          'id': 10,
          'status': 'INPROGRESS',
          'stage': 'NEW',
          'executor': 'Rachael Sparks',
          'executorId': 5,
          'priority': 4,
          'plannedTime': 14,
          'factTime': 20,
          'subtasks': 5
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 11,
          'status': 'INHOLD',
          'stage': 'DEVELOP',
          'executor': 'Hays Murray',
          'executorId': 5,
          'priority': 2,
          'plannedTime': 16,
          'factTime': 28,
          'subtasks': 4
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 12,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Price White',
          'executorId': 4,
          'priority': 1,
          'plannedTime': 24,
          'factTime': 20,
          'subtasks': 0
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 13,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Geraldine Cline',
          'executorId': 0,
          'priority': 2,
          'plannedTime': 14,
          'factTime': 20,
          'subtasks': 0
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 14,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Landry Skinner',
          'executorId': 2,
          'priority': 4,
          'plannedTime': 15,
          'factTime': 9,
          'subtasks': 0
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 15,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'Misty Sexton',
          'executorId': 0,
          'priority': 2,
          'plannedTime': 18,
          'factTime': 26,
          'subtasks': 2
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 16,
          'status': 'INPROGRESS',
          'stage': 'DEVELOP',
          'executor': 'Angie Mcguire',
          'executorId': 1,
          'priority': 2,
          'plannedTime': 3,
          'factTime': 9,
          'subtasks': 3
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 17,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Daniels Ramirez',
          'executorId': 2,
          'priority': 1,
          'plannedTime': 17,
          'factTime': 13,
          'subtasks': 1
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 18,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Marshall Edwards',
          'executorId': 1,
          'priority': 4,
          'plannedTime': 1,
          'factTime': 5,
          'subtasks': 3
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 19,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Hebert Hunter',
          'executorId': 5,
          'priority': 4,
          'plannedTime': 6,
          'factTime': 14,
          'subtasks': 4
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 20,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Finch Mercer',
          'executorId': 0,
          'priority': 2,
          'plannedTime': 12,
          'factTime': 29,
          'subtasks': 3
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 21,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Priscilla Crosby',
          'executorId': 2,
          'priority': 2,
          'plannedTime': 5,
          'factTime': 25,
          'subtasks': 2
        },
        {
          'name': 'Back. Голосование, снятие голоса',
          'id': 22,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Jodi Galloway',
          'executorId': 3,
          'priority': 3,
          'plannedTime': 10,
          'factTime': 27,
          'subtasks': 0
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 23,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Goldie Leblanc',
          'executorId': 5,
          'priority': 3,
          'plannedTime': 1,
          'factTime': 21,
          'subtasks': 3
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 24,
          'status': 'INPROGRESS',
          'stage': 'DEVELOP',
          'executor': 'Jacobs Gentry',
          'executorId': 0,
          'priority': 2,
          'plannedTime': 5,
          'factTime': 7,
          'subtasks': 3
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 25,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Riggs Beach',
          'executorId': 1,
          'priority': 2,
          'plannedTime': 16,
          'factTime': 4,
          'subtasks': 4
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 26,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Trujillo Newman',
          'executorId': 4,
          'priority': 3,
          'plannedTime': 6,
          'factTime': 17,
          'subtasks': 1
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 27,
          'status': 'INPROGRESS',
          'stage': 'CODE_REVIEW',
          'executor': 'Neal Curry',
          'executorId': 3,
          'priority': 4,
          'plannedTime': 7,
          'factTime': 11,
          'subtasks': 2
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 28,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Sheree Day',
          'executorId': 5,
          'priority': 3,
          'plannedTime': 4,
          'factTime': 27,
          'subtasks': 2
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 29,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Rowe Meadows',
          'executorId': 3,
          'priority': 3,
          'plannedTime': 16,
          'factTime': 9,
          'subtasks': 0
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 30,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Annette Wooten',
          'executorId': 1,
          'priority': 5,
          'plannedTime': 24,
          'factTime': 21,
          'subtasks': 2
        },
        {
          'name': 'Back. Голосование, снятие голоса',
          'id': 31,
          'status': 'INHOLD',
          'stage': 'NEW',
          'executor': 'Marcella House',
          'executorId': 0,
          'priority': 4,
          'plannedTime': 23,
          'factTime': 11,
          'subtasks': 1
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 32,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Susana Brady',
          'executorId': 5,
          'priority': 2,
          'plannedTime': 2,
          'factTime': 22,
          'subtasks': 5
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 33,
          'status': 'INPROGRESS',
          'stage': 'CODE_REVIEW',
          'executor': 'Meagan Carr',
          'executorId': 0,
          'priority': 4,
          'plannedTime': 1,
          'factTime': 4,
          'subtasks': 0
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 34,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Galloway Baldwin',
          'executorId': 1,
          'priority': 4,
          'plannedTime': 11,
          'factTime': 12,
          'subtasks': 5
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 35,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'Villarreal Huff',
          'executorId': 5,
          'priority': 5,
          'plannedTime': 19,
          'factTime': 2,
          'subtasks': 2
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 36,
          'status': 'INPROGRESS',
          'stage': 'DONE',
          'executor': 'Mcgee Oneal',
          'executorId': 5,
          'priority': 2,
          'plannedTime': 15,
          'factTime': 9,
          'subtasks': 5
        },
        {
          'name': 'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
          'id': 37,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Griffin Malone',
          'executorId': 5,
          'priority': 5,
          'plannedTime': 20,
          'factTime': 29,
          'subtasks': 3
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 38,
          'status': 'INHOLD',
          'stage': 'DONE',
          'executor': 'Nichole Grimes',
          'executorId': 5,
          'priority': 1,
          'plannedTime': 14,
          'factTime': 6,
          'subtasks': 0
        },
        {
          'name': 'Киви-Банк - Артек: Ретроспектива 02.06.17',
          'id': 39,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'French Dunn',
          'executorId': 4,
          'priority': 5,
          'plannedTime': 1,
          'factTime': 5,
          'subtasks': 4
        },
        {
          'name': 'Back. Голосование, снятие голоса',
          'id': 40,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Davidson Rutledge',
          'executorId': 2,
          'priority': 2,
          'plannedTime': 8,
          'factTime': 28,
          'subtasks': 4
        },
        {
          'name': 'TASK: Перевод денег из семьи члену семьи',
          'id': 41,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'Ferguson Calhoun',
          'executorId': 3,
          'priority': 1,
          'plannedTime': 6,
          'factTime': 25,
          'subtasks': 1
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 42,
          'status': 'INPROGRESS',
          'stage': 'NEW',
          'executor': 'Janette Valdez',
          'executorId': 0,
          'priority': 5,
          'plannedTime': 17,
          'factTime': 0,
          'subtasks': 0
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 43,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'Nancy Delgado',
          'executorId': 2,
          'priority': 1,
          'plannedTime': 19,
          'factTime': 26,
          'subtasks': 2
        },
        {
          'name': 'Back. Голосование, снятие голоса',
          'id': 44,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Bright Cantu',
          'executorId': 3,
          'priority': 5,
          'plannedTime': 0,
          'factTime': 27,
          'subtasks': 2
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 45,
          'status': 'INHOLD',
          'stage': 'QA',
          'executor': 'Mcclain Herring',
          'executorId': 4,
          'priority': 4,
          'plannedTime': 2,
          'factTime': 11,
          'subtasks': 3
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 46,
          'status': 'INPROGRESS',
          'stage': 'QA',
          'executor': 'Lessie Franklin',
          'executorId': 2,
          'priority': 1,
          'plannedTime': 3,
          'factTime': 17,
          'subtasks': 3
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 47,
          'status': 'INHOLD',
          'stage': 'DEVELOP',
          'executor': 'Ryan Levine',
          'executorId': 2,
          'priority': 4,
          'plannedTime': 0,
          'factTime': 18,
          'subtasks': 3
        },
        {
          'name': 'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
          'id': 48,
          'status': 'INHOLD',
          'stage': 'DONE',
          'executor': 'Kristen Bridges',
          'executorId': 3,
          'priority': 5,
          'plannedTime': 22,
          'factTime': 17,
          'subtasks': 1
        },
        {
          'name': 'UI. Интеграции таба со счетами для страницы пользователя',
          'id': 49,
          'status': 'INHOLD',
          'stage': 'CODE_REVIEW',
          'executor': 'Jillian Kirkland',
          'executorId': 4,
          'priority': 1,
          'plannedTime': 3,
          'factTime': 2,
          'subtasks': 2
        }
      ]
    };

    const mine = [];
    const other = [];
    const mineSorted = { new: [], dev: [], codeReview: [], qa: [], done: [] };
    const otherSorted = { new: [], dev: [], codeReview: [], qa: [], done: [] };

    sprint.tasks.forEach((element) => {
      if (element.executorId === 2) {
        mine.push(element);
      } else {
        other.push(element);
      }
    });

    const filterTasks = (array, sortedObject) => {
      array.forEach((element) => {
        switch (element.stage) {
          case 'NEW':
            sortedObject.new.push(element);
            break;
          case 'DEVELOP':
            sortedObject.dev.push(element);
            break;
          case 'CODE_REVIEW':
            sortedObject.codeReview.push(element);
            break;
          case 'QA':
            sortedObject.qa.push(element);
            break;
          case 'DONE':
            sortedObject.done.push(element);
            break;
          default:
            break;
        }
      });
    };

    filterTasks(mine, mineSorted);
    filterTasks(other, otherSorted);

    const sortTasks = (sortedObject) => {
      for (const key in sortedObject) {
        sortedObject[key].sort((a, b) => {
          if (a.priority > b.priority) return 1;
          if (a.priority < b.priority) return -1;
        });
        sortedObject[key] = sortedObject[key].map((element) => {
          return <TaskCard key={element.id} task={element}/>;
        });
      }
    };

    sortTasks(mineSorted);
    sortTasks(otherSorted);

    return (
      <section className={css.agileBoard}>
        <h2>{sprint.name} ({sprint.dateStart} - {sprint.dateEnd})</h2>
        <h3>Мои задачи</h3>
        <Row>
          <Col xs>
            <h4>New</h4>
            {mineSorted.new}
          </Col>
          <Col xs>
            <h4>Develop</h4>
            {mineSorted.dev}
          </Col>
          <Col xs>
            <h4>Code Review</h4>
            {mineSorted.codeReview}
          </Col>
          <Col xs>
            <h4>QA</h4>
            {mineSorted.qa}
          </Col>
          <Col xs>
            <h4>Done</h4>
            {mineSorted.done}
          </Col>
        </Row>
        <h3>Прочие</h3>
        <Row>
          <Col xs>
            <h4>New</h4>
            {otherSorted.new}
          </Col>
          <Col xs>
            <h4>Develop</h4>
            {otherSorted.dev}
          </Col>
          <Col xs>
            <h4>Code Review</h4>
            {otherSorted.codeReview}
          </Col>
          <Col xs>
            <h4>QA</h4>
            {otherSorted.qa}
          </Col>
          <Col xs>
            <h4>Done</h4>
            {otherSorted.done}
          </Col>
        </Row>
      </section>
    );
  }
}
