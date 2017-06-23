import React, { Component } from 'react';
import classnames from 'classnames';
import * as css from './Planning.scss';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import TaskRow from '../../../components/TaskRow';
import Button from '../../../components/Button';

//Mocks

const tasks = [];
const getRandomString = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getSomeRandomString = (arr) => {
  const start = Math.floor(Math.random() * arr.length);
  const end = arr.length - start;
  return arr.splice(start, end);
};

for (let i = 0; i < 15; i++) {
  const mockTags = [];

  tasks.push({
    name: getRandomString([
    'Back. REST для просмотра товаров на голосовании, выбора товара для голосования, покупки товара',
    'Back. Голосование, снятие голоса", "UI. Интеграции таба со счетами для страницы пользователя',
    'Киви-Банк - Артек: Ретроспектива 02.06.17',
    'Bug: При покупке семейного товара в раздел Голосование профиля семьи не подтягивается значение полей Название и Стоимость товара',
    'TASK: Перевод денег из семьи члену семьи',
    'UI. Интеграции таба со счетами для страницы пользователя'
  ]),
    tags: mockTags.concat(getSomeRandomString(['refactor', 'верстка', 'demo', 'release', 'design', 'совещание']), getRandomString(['UI', 'backend'])),
    prefix: getRandomString(['MT-12', 'MT-254', 'MT-1245']),
    sprint: getRandomString(['Спринт №1', 'Спринт №1', 'Спринт №1']),
    id: i,
    status: getRandomString(['INHOLD', 'INPROGRESS']),
    type: getRandomString(['Фича / Задача', 'Баг']),
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

const sortTasks = (sortedArr) => {
  // tasks.sort((a, b) => {
  //   if (a.priority > b.priority) return 1;
  //   if (a.priority < b.priority) return -1;
  // });
  return sortedArr.map((element) => {
    return <TaskRow key={element.id} task={element} shortcut card/>;
  });
};

const sortedTasks = sortTasks(tasks);

export default class Planning extends Component {

  render () {

    return (
      <div>
        <section>
          <Button type="primary" text="Создать спринт" icon="IconPlus" style={{marginBottom: 16}}/>
          <div className={css.graph}>
            <div className={css.wrapper}>
              <div className={css.sprintNames}>
                <div></div>
                <div></div>
                <div><span className={css.selection}/><span className={css.name}>Спринт №1</span></div>
                <div><span className={css.selection}/><span className={css.name}>Спринт №2</span></div>
                <div><span className={css.selection}/><span className={css.name}>Спринт №3</span></div>
                <div><span className={css.selection}/><span className={css.name}>Спринт №4</span></div>
                <div><span className={css.selection}/><span className={css.name}>Очень длинное название спринта</span></div>
              </div>
              <div className={css.table}>
                <div className={css.tr}>
                  <div className={css.year}>2016</div>
                  <div className={css.year}>2017</div>
                  <div className={css.year}>2018</div>
                </div>
                <div className={css.tr}>
                  <div className={css.nameHeader}></div>
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.finished]: true})} style={{left: '13%', right: '83%'}}></div>
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.finished]: true})} style={{left: '17%', right: '81%'}}></div>
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.active]: true})} style={{left: '19%', right: '79%'}}></div>
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.future]: true})} style={{left: '21%', right: '75%'}}></div>
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.future]: true})} style={{left: '25%', right: '72%'}}></div>
                </div>
                <div className={css.grid}>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                  <span/>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xs={6}>
              <h2 className={css.boardTitle}>
                Backlog
                <Button type="primary" text="Создать задачу" icon="IconPlus" style={{marginLeft: 16}}/>
              </h2>
              <div>
                {sortedTasks.slice(3, 6)}
              </div>
            </Col>
            <Col xs={6}>
              <h2 className={css.boardTitle}>Спринт №3</h2>
              <div>
                {sortedTasks}
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
};
