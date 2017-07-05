import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';

import * as css from './Settings.scss';
import SprintCard from '../../../components/SprintCard';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';

//Mocks

const sprints = [
  {
    name: 'Спринт №1',
    dateStart: '06.06.2017',
    dateEnd: '12.06.2017',
    tasksTotal: '35',
    tasksDone: '34',
    status: 'INHOLD'
  },
  {
    name: 'Спринт №2',
    dateStart: '12.06.2017',
    dateEnd: '24.06.2017',
    tasksTotal: '35',
    tasksDone: '1',
    status: 'INPROGRESS'
  },
  {
    name: 'Спринт №3',
    dateStart: '24.06.2017',
    dateEnd: '01.07.2017',
    tasksTotal: '40',
    tasksDone: '0',
    status: 'INHOLD'
  }
];

class Settings extends Component {
  render () {
    const sprintList = sprints.map((element, i) => {
      return (
        <Col xs={3} key={i}>
          <SprintCard sprint={element} />
        </Col>
      );
    });

    return (
      <div className={css.property}>
        <h2>Участники</h2>
        <Row className={classnames(css.memberRow, css.memberHeader)}>
          <Col xs={9} xsOffset={3}>
            <Row>
              <Col xs>
                <h4>
                  <div className={css.cell}>Develop</div>
                </h4>
              </Col>
              <Col xs>
                <h4>
                  <div className={css.cell}>Back</div>
                </h4>
              </Col>
              <Col xs>
                <h4>
                  <div className={css.cell}>Front</div>
                </h4>
              </Col>
              <Col xs>
                <h4>
                  <div className={css.cell}>Code Review</div>
                </h4>
              </Col>
              <Col xs>
                <h4>
                  <div className={css.cell}>QA</div>
                </h4>
              </Col>
              <Col xs>
                <h4>
                  <div className={css.cell}>Unbillable</div>
                </h4>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123">
              <div className={classnames(css.cell, css.memberColumn)}>
                Бронислав Пупков
              </div>
            </Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123">
              <div className={classnames(css.cell, css.memberColumn)}>
                Александра Одиннадцатиклассница
              </div>
            </Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123">
              <div className={classnames(css.cell, css.memberColumn)}>
                Никита Джугашвили
              </div>
            </Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123">
              <div className={classnames(css.cell, css.memberColumn)}>
                Николай Липотин
              </div>
            </Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123">
              <div className={classnames(css.cell, css.memberColumn)}>
                Андрей Юдин
              </div>
            </Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
              <Col xs>
                <label className={css.cell}>
                  <Checkbox />
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Button
          text="Добавить участника"
          type="primary"
          style={{ marginTop: 16 }}
          icon="IconPlus"
        />
        <hr />
        <h2>Спринты / Фазы</h2>
        <Row>
          {sprintList}
        </Row>
        <Button
          text="Создать спринт"
          type="primary"
          style={{ marginTop: 16 }}
          icon="IconPlus"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprints: state.Project.project.sprintList
});

Settings.propTypes = {
  sprints: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(Settings);
