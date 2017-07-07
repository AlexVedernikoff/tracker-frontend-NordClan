import React, { Component } from 'react';
import GanttChart from './GanttChart';
import classnames from 'classnames';
import * as css from './Planning.scss';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import DraggableTaskRow from './DraggableTaskRow';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import SprintColumn from './SprintColumn';

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

for (let i = 0; i < 30; i++) {
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
    sprint: getRandomString(['sprint1', 'sprint2', 'sprint3', 'sprint4', 'backlog']),
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

//const sortTasks = (sortedArr) => {
//   tasks.sort((a, b) => {
//     if (a.priority > b.priority) return 1;
//     if (a.priority < b.priority) return -1;
//   });
//   return sortedArr.map((element) => {
//     return <TaskRow key={element.id} task={element} shortcut card/>;
//   });
// };

//const sortedTasks = sortTasks(tasks);

const sprintTasks = {
  sprint1: [],
  sprint2: [],
  sprint3: [],
  sprint4: [],
  backlog: []
};

tasks.map((element) => {
    sprintTasks[element.sprint].push(<DraggableTaskRow key={element.id} task={element} shortcut card/>);
});

export default class Planning extends Component {

  constructor (props) {
    super(props);
    this.state = {
      changedSprint: 'sprint1',
      leftColumn: 'backlog',
      rightColumn: 'sprint1'
    };
  }

  selectValue = (e, name) => {
    this.setState({[name]: e ? e.value : null});
  }

  getSprints = (column) => {
    const secondColumn = column === 'leftColumn' ? 'rightColumn' : 'leftColumn';
    const sprints = [
      { value: 'sprint1', label: 'Спринт №1 (01.06.2017 - 30.06.2017)', className: classnames({[css.INPROGRESS]: true, [css.sprintMarker]: true }) },
      { value: 'sprint2', label: 'Спринт №2 (01.06.2017 - 30.06.2017)', className: classnames({[css.PLANNED]: true, [css.sprintMarker]: true }) },
      { value: 'sprint3', label: 'Спринт №3 (01.06.2017 - 30.06.2017)', className: classnames({[css.FINISHED]: true, [css.sprintMarker]: true }) },
      { value: 'sprint4', label: 'Спринт №4 (01.06.2017 - 30.06.2017)', className: classnames({[css.FINISHED]: true, [css.sprintMarker]: true }) },
      { value: 'backlog', label: 'Backlog', className: classnames({[css.INPROGRESS]: true, [css.sprintMarker]: true }) }
    ];

    sprints.forEach((sprint) => {
      sprint.disabled = sprint.value === this.state[secondColumn];
    });

    return sprints;
  }

  dropTask = (task, sprint) => {
    let i, movedTask;

    for (i in sprintTasks[task.previousSprint]) {
      if (sprintTasks[task.previousSprint][i].props.task.id === task.id) {
        movedTask = sprintTasks[task.previousSprint].splice(i, 1)[0];
      }
    }

    movedTask.props.task.sprint = sprint;
    sprintTasks[sprint].push(movedTask);
    this.forceUpdate();
  }

  render () {

    return (
      <div>
        <section>
          <Button type="primary" text="Создать спринт" icon="IconPlus" style={{marginBottom: 16}}/>
          <div className={css.graph}>
            <div className={css.wrapper}>
              <div className={css.sprintNames}>
                <div />
                <div />
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
                  <div className={css.nameHeader} />
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
                  <div className={classnames({[css.sprintBar]: true, [css.finished]: true})} style={{left: '13%', right: '83%'}} />
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.finished]: true})} style={{left: '17%', right: '81%'}} />
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.active]: true})} style={{left: '19%', right: '79%'}} />
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.future]: true})} style={{left: '21%', right: '75%'}} />
                </div>
                <div className={css.tr}>
                  <div className={classnames({[css.sprintBar]: true, [css.future]: true})} style={{left: '25%', right: '72%'}} />
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
              <div className={css.headerColumn}>
                <div className={css.selectWrapper}>
                  <SelectDropdown
                    name="leftColumn"
                    placeholder="Введите название спринта..."
                    multi={false}
                    value={this.state.leftColumn}
                    onChange={(e) => this.selectValue(e, 'leftColumn')}
                    noResultsText="Нет результатов"
                    options={this.getSprints('leftColumn')}
                  />
                </div>
                <Button type="bordered" text="Создать задачу" icon="IconPlus" style={{marginLeft: 16}}/>
              </div>
              <div className={css.progressBarWrapper} data-tip="Суммарное время задач: 795 ч. из 500">
                <div className={classnames({[css.progressBar]: true, [css.exceeded]: true})} style={{width: '100%'}}/>
              </div>
              {
                  this.state.leftColumn
                  ? <SprintColumn onDrop={this.dropTask} sprint={this.state.leftColumn} tasks={sprintTasks[this.state.leftColumn]}/>
                  : null
              }
            </Col>
            <Col xs={6}>
              <div className={css.headerColumn}>
                <div className={css.selectWrapper}>
                  <SelectDropdown
                    name="rightColumn"
                    placeholder="Введите название спринта..."
                    multi={false}
                    value={this.state.rightColumn}
                    onChange={(e) => this.selectValue(e, 'rightColumn')}
                    noResultsText="Нет результатов"
                    options={this.getSprints('rightColumn')}
                  />
                </div>
                <Button type="bordered" text="Создать задачу" icon="IconPlus" style={{marginLeft: 16}}/>
              </div>
              <div className={css.progressBarWrapper} data-tip="Суммарное время задач: 257 ч. из 500">
                <div className={classnames({[css.progressBar]: true, [css.exceeded]: false})} style={{width: '58%'}}/>
              </div>
              {
                  this.state.rightColumn
                  ? <SprintColumn onDrop={this.dropTask} sprint={this.state.rightColumn} tasks={sprintTasks[this.state.rightColumn]}/>
                  : null
              }
            </Col>
          </Row>
        </section>
        <GanttChart />
      </div>
    );
  }
}
