import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';

import TaskCard from '../../../components/TaskCard';
import SelectDropdown from '../../../components/SelectDropdown';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';
import * as css from './AgileBoard.scss';

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
    id: i,
    status: getRandomString(['INHOLD', 'INPROGRESS']),
    stage: getRandomString(['NEW', 'DEVELOP', 'QA', 'CODE_REVIEW', 'QA', 'DONE']),
    executor: getRandomString(['Андрей Юдин', 'Александра Одноклассница', 'Иосиф Джугашвили', 'Ксенофонт Арабский', 'Не назначено']),
    executorId: getRandomString([1, 2, 3, 4, 5]),
    priority: getRandomString([1, 2, 3, 4, 5]),
    plannedTime: getRandomString([8, 9, 10, 11, 12, 13, 14, 15, 16]),
    factTime: getRandomString([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
    subtasks: getRandomString([1, 2, 3, 4, 5]),
    linkedTasks: getRandomString([1, 2, 3, 4, 5])
  });
}

const mine = [];
const other = [];
const mineSorted = { new: [], dev: [], codeReview: [], qa: [], done: [] };
const otherSorted = { new: [], dev: [], codeReview: [], qa: [], done: [] };

tasks.forEach((element) => {
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
export default class AgileBoard extends Component {
  static propTypes = {
  }

  constructor (props) {
    super(props);
    this.state = {
      isSectionOpen: {
        myTasks: true,
        otherTasks: true
      },
      filterTags: [],
      changedSprint: 'sprint1'
    };
  }


  toggleSection = (sectionName) => {
    const otherSectionsStatus = this.state.isSectionOpen;
    this.setState({
      isSectionOpen: {
        ...otherSectionsStatus,
        [sectionName]: !this.state.isSectionOpen[sectionName]
      }
    });
  }

  selectValue = (e, name) => {
    this.setState({[name]: e});
  }

  render () {
    return (
      <section className={css.agileBoard}>
        {/*<h2 style={{display: 'inline-block'}}>Спринт №1 (01.06.2017 - 30.06.2017)</h2>*/}
        <Row>
          <Col xs>
            <SelectDropdown
              name="changedSprint"
              placeholder="Введите название спринта..."
              multi={false}
              value={this.state.changedSprint}
              onChange={(e) => this.selectValue(e, 'changedSprint')}
              noResultsText="Нет результатов"
              options={[
                { value: 'sprint1', label: 'Спринт №1 (01.06.2017 - 30.06.2017)' },
                { value: 'sprint2', label: 'Спринт №2 (01.06.2017 - 30.06.2017)' },
                { value: 'sprint3', label: 'Спринт №3 (01.06.2017 - 30.06.2017)' },
                { value: 'sprint4', label: 'Спринт №4 (01.06.2017 - 30.06.2017)' }
              ]}
            />
          </Col>
          <Col xs>
            <SelectDropdown
              name="filterTags"
              multi
              placeholder="Введите название тега..."
              backspaceToRemoveMessage="BackSpace для очистки поля"
              value={this.state.filterTags}
              onChange={(e) => this.selectValue(e, 'filterTags')}
              noResultsText="Нет результатов"
              options={[
                {value: 'develop', label: 'develop'},
                {value: 'frontend', label: 'frontend'},
                {value: 'backend', label: 'backend'}
              ]}
            />
          </Col>
        </Row>
        <hr/>
        <h3 onClick={() => this.toggleSection('myTasks')} className={css.taskSectionTitle}>
          <IconArrowDown className={classnames({
            [css.close]: !this.state.isSectionOpen.myTasks,
            [css.open]: this.state.isSectionOpen.myTasks
          })} /> Мои задачи
        </h3>
        {
          this.state.isSectionOpen.myTasks
          ? <Row>
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
          : null
        }
        <hr/>
        <h3 onClick={() => this.toggleSection('otherTasks')} className={css.taskSectionTitle}>
          <IconArrowDown className={classnames({
            [css.close]: !this.state.isSectionOpen.otherTasks,
            [css.open]: this.state.isSectionOpen.otherTasks
          })} /> Прочие
        </h3>
        {
          this.state.isSectionOpen.otherTasks
          ? <Row>
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
          : null
        }
        <hr/>
      </section>
    );
  }
}
