import React, { Component } from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import * as css from './Projects.scss';
import Tag from '../../components/Tag';
import SelectDropdown from '../../components/SelectDropdown';

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
            <Col xs={4}>
              <div className={css.projectCard}>
                <h3>
                  <Link to="/projects/1">ПроРейтинг - HR-инструмент</Link>
                </h3>
                <div className={css.tags}>
                  <Tag name="design" blocked />
                  <Tag name="react" blocked />
                  <Tag name="redux" blocked />
                  <Tag name="java" blocked />
                  <Tag name="коммерческий" blocked />
                </div>
                <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>06.06.2017 - 23.12.2018</span>
                </div>
                <div className={css.meta}>
                  <span>Текущий спринт:</span>
                  <span>Спринт №1 (06.06.2017 - 23.12.2018)</span>
                </div>
                <div className={css.meta}>
                  <span>Участников:</span>
                  <span>5</span>
                </div>
              </div>
            </Col>
            <Col xs={4}>
              <div className={css.projectCard}>
                <h3>
                  <Link to="/projects/1">MakeTalents</Link>
                </h3>
                <div className={css.tags}>
                  <Tag name="frontend" blocked />
                  <Tag name="angular.js" blocked />
                  <Tag name="java" blocked />
                  <Tag name="внутренний" blocked />
                </div>
                <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>06.06.2017 - 23.12.2018</span>
                </div>
                <div className={css.meta}>
                  <span>Текущий спринт:</span>
                  <span>Спринт №1 (06.06.2017 - 23.12.2018)</span>
                </div>
                <div className={css.meta}>
                  <span>Участников:</span>
                  <span>5</span>
                </div>
              </div>
            </Col>
            <Col xs={4}>
              <div className={css.projectCard}>
                <h3>
                  <Link to="/projects/1">SimTrack</Link>
                </h3>
                <div className={css.tags}>
                  <Tag name="frontend" blocked />
                  <Tag name="react" blocked />
                  <Tag name="redux" blocked />
                  <Tag name="node.js" blocked />
                  <Tag name="внутренний" blocked />
                </div>
                <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>06.06.2017 - 23.12.2018</span>
                </div>
                <div className={css.meta}>
                  <span>Текущий спринт:</span>
                  <span>Спринт №1 (06.06.2017 - 23.12.2018)</span>
                </div>
                <div className={css.meta}>
                  <span>Участников:</span>
                  <span>5</span>
                </div>
              </div>
            </Col>
            <Col xs={4}>
              <div className={css.projectCard}>
                <h3>
                  <Link to="/projects/1">Qiwi-Artek</Link>
                </h3>
                <div className={css.tags}>
                  <Tag name="frontend" blocked />
                  <Tag name="react" blocked />
                  <Tag name="redux" blocked />
                  <Tag name="java" blocked />
                  <Tag name="коммерческий" blocked />
                </div>
                <div className={css.meta}>
                  <span>Сроки:</span>
                  <span>06.06.2017 - 23.12.2018</span>
                </div>
                <div className={css.meta}>
                  <span>Текущий спринт:</span>
                  <span>Спринт №1 (06.06.2017 - 23.12.2018)</span>
                </div>
                <div className={css.meta}>
                  <span>Участников:</span>
                  <span>5</span>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    );
  }
}

