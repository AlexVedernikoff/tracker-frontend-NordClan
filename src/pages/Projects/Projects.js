import React, { Component } from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import * as css from './Projects.scss';
import Tag from '../../components/Tag';
import SelectDropdown from '../../components/SelectDropdown';
import ProjectCard from '../../components/ProjectCard';

// Mocks

const projects = [];
const getRandomString = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
const getSomeRandomString = (arr) => {
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

for (let i = 0; i < 15; i++) {
  projects.push({
    name: getRandomString(['MakeTalents', 'SimTrack', 'Qiwi-Artek', 'ПроРейтинг - HR-инструмент', 'Корпоративные сайты SimbirSoft', 'Аудит информационной безопасности', 'Онлайн-опросы (ООО "Top of Mind Research")', 'ИП Хабибрахманов Р.Р. - ФЛЭТ CRM Битрикс24']),
    tags: [
      getSomeRandomString(['frontend', 'java', 'C++', 'php'])
      // getRandomString(['angular.js', 'angular', 'react']),
      // getRandomString(['mobile', 'web', 'desktop app']),
      // getRandomString(['2017', '2016', '2015']),
      // getRandomString(['внутренний', 'коммерческий'])
    ],
    dateStart: '06.06.2017',
    dateEnd: '26.12.2017',
    activeSprint: {
      name: getRandomString(['Спринт №1', 'Спринт №2', 'Спринт №3', 'Спринт №4']),
      dateStart: '06.06.2017',
      dateEnd: '26.12.2017'
    },
    status: getRandomString(['INPROGRESS', 'INHOLD', 'FINISHED'])
  });
}

const projectList = projects.map(
  (element, i) => <Col xs={4} key={i}><ProjectCard project={element}/></Col>
);

export default class Projects extends Component {
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

  selectValue = (e, name) => {
    this.setState({[name]: e});
  }

  render () {
    return (
      <div>
        <section>
          <h1>Мои проекты</h1>
          <hr/>
          <div className={css.filters}>
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
                {value: 'inner', label: 'внутренний'},
                {value: 'commerce', label: 'коммерческий'},
                {value: 'frontend', label: 'frontend'},
                {value: 'backend', label: 'backend'}
              ]}
            />
          </div>
          <Row>
            {projectList}
          </Row>
        </section>
      </div>
    );
  }
}

