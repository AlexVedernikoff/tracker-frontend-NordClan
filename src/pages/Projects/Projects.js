import React, { Component } from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import * as css from './Projects.scss';
import SelectDropdown from '../../components/SelectDropdown';
import { IconFolderOpen } from '../../components/Icons';
import Button from '../../components/Button';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import ProjectCard from '../../components/ProjectCard';
import StatusCheckbox from './StatusCheckbox';
import Pagination from "../../components/Pagination";

// Mocks

const projects = [];
const getRandomString = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getSomeRandomString = arr => {
  const start = Math.floor(Math.random() * arr.length);
  const end = arr.length - start;
  return arr.splice(start, end);
};

const mockTags = [];

for (let i = 0; i < 15; i++) {
  projects.push({
    id: i,
    name: getRandomString([
      'MakeTalents',
      'Киви-Банк - {Всем',
      'Грехов И.В.- "BookReview"',
      'SimTrack',
      'Qiwi-Artek',
      'ПроРейтинг - HR-инструмент',
      'Корпоративные сайты SimbirSoft',
      'Аудит информационной безопасности',
      'Онлайн-опросы (ООО "Top of Mind Research")',
      'ИП Хабибрахманов Р.Р. - ФЛЭТ CRM Битрикс24'
    ]),
    tags: mockTags.concat(
      getSomeRandomString([
        'frontend',
        'java',
        'C++',
        'php',
        'angular.js',
        'angular',
        'react'
      ]),
      getRandomString(['2017', '2016', '2015']),
      getRandomString(['внутренний', 'коммерческий'])
    ),
    dateStart: '06.06.2017',
    dateEnd: '26.12.2017',
    activeSprint: {
      name: getRandomString([
        'Спринт №1',
        'Спринт №2',
        'Спринт №3',
        'Спринт №4'
      ]),
      dateStart: '06.06.2017',
      dateEnd: '26.12.2017'
    },
    status: getRandomString(['INPROGRESS', 'INHOLD', 'FINISHED']),
    members: getRandomString(['5', '15', '20'])
  });
}

const projectFolder = {
  name: 'MakeTalents new UI',
  children: [
    {
      id: 0,
      name: 'MakeTalents - Android',
      tags: ['android', 'angular.js', 'frontend', '2016', 'внутренний'],
      dateStart: '06.06.2017',
      dateEnd: '26.12.2017',
      activeSprint: {
        name: 'Спринт №36',
        dateStart: '06.06.2017',
        dateEnd: '26.12.2017'
      },
      status: 'INPROGRESS',
      members: '20'
    },
    {
      id: 1,
      name: 'MakeTalents - iOS',
      tags: ['iOS', 'angular.js', 'frontend', '2016', 'внутренний'],
      dateStart: '06.06.2017',
      dateEnd: '26.12.2017',
      activeSprint: {
        name: 'Спринт №36',
        dateStart: '06.06.2017',
        dateEnd: '26.12.2017'
      },
      status: 'INPROGRESS',
      members: '20'
    },
    {
      id: 1,
      name: 'MakeTalents - web',
      tags: ['web', 'angular.js', 'frontend', '2016', 'внутренний'],
      dateStart: '06.06.2017',
      dateEnd: '26.12.2017',
      activeSprint: {
        name: 'Спринт №36',
        dateStart: '06.06.2017',
        dateEnd: '26.12.2017'
      },
      status: 'INPROGRESS',
      members: '20'
    }
  ]
};

const projectList = projects.map((element, i) =>
  <ProjectCard key={i} project={element} />
);
const projectFolderNode = (
  <div style={{ marginBottom: 24 }} key={321654}>
    <h2 style={{ marginBottom: 32 }}>
      {/*<IconFolderOpen style={{color: 'silver'}} />*/} {projectFolder.name}
    </h2>
    <ProjectCard project={projectFolder.children[0]} isChild key={1} />
    <ProjectCard project={projectFolder.children[1]} isChild key={2} />
    <ProjectCard project={projectFolder.children[2]} isChild key={3} />
  </div>
);
projectList[3] = projectFolderNode;

export default class Projects extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isSectionOpen: {
        myTasks: true,
        otherTasks: true
      },
      filterTags: [],
      filteredInProgress: false,
      filteredInHold: false,
      filteredFinished: false
    };
  }

  check = name => {
    const oldValue = this.state[name];
    this.setState({
      [name]: !oldValue
    });
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  handlePaginationClick = (e) => {
    e.preventDefault;
  }

  render() {
    const { filteredInProgress, filteredInHold, filteredFinished } = this.state;

    return (
      <div>
        <section>
          <header className={css.title}>
            <h1 className={css.title}>Мои проекты</h1>
            <Button text="Создать проект" type="primary" icon="IconPlus" />
            <Button text="Создать портфель" type="primary" icon="IconPlus" />
          </header>
          <hr />
          <div className={css.projectsHeader}>
            <div className={css.statusFilters}>
              <StatusCheckbox
                type="INPROGRESS"
                checked={filteredInProgress}
                onClick={() => this.check('filteredInProgress')}
                label="В процессе"
              />
              <StatusCheckbox
                type="INHOLD"
                checked={filteredInHold}
                onClick={() => this.check('filteredInHold')}
                label="Приостановлен"
              />
              <StatusCheckbox
                type="FINISHED"
                checked={filteredFinished}
                onClick={() => this.check('filteredFinished')}
                label="Завершен"
              />
            </div>
            <Row>
              <Col xs>
                <Input placeholder="Введите название проекта..." />
              </Col>
              <Col xs>
                <Row>
                  <Col xs>
                    <DatepickerDropdown locale="ru" placeholderText="От" />
                  </Col>
                  <Col xs>
                    <DatepickerDropdown locale="ru" placeholderText="До" />
                  </Col>
                </Row>
              </Col>
              <Col xs>
                <SelectDropdown
                  name="filterTags"
                  multi
                  placeholder="Введите название тега..."
                  backspaceToRemoveMessage="BackSpace для очистки поля"
                  value={this.state.filterTags}
                  onChange={e => this.selectValue(e, 'filterTags')}
                  noResultsText="Нет результатов"
                  options={[
                    { value: 'develop', label: 'develop' },
                    { value: 'frontend', label: 'frontend' },
                    { value: 'inner', label: 'внутренний' },
                    { value: 'commerce', label: 'коммерческий' },
                    { value: 'frontend', label: 'frontend' },
                    { value: 'backend', label: 'backend' }
                  ]}
                />
              </Col>
            </Row>
          </div>
          <div>
            {projectList}
          </div>
          <hr/>
          {2 > 1
            ? <Pagination
                itemsCount={3}
                activePage={3}
                onItemClick={this.handlePaginationClick}
              />
            : null}
        </section>
      </div>
    );
  }
}
