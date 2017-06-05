import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';

import * as css from './Property.scss';
import SprintCard from '../../../components/SprintCard';
import Button from '../../../components/Button';
export default class Property extends Component {
  static propTypes = {
  }

  render () {

    return (
      <div className={css.property}>
        <h2>Настройки</h2>
        <hr/>
        <h3>Участники:</h3>
        <Row className={classnames(css.memberRow, css.memberHeader)}>
          <Col xs={9} xsOffset={3}>
            <Row>
              <Col xs>
                <h4><div className={css.cell}>Develop</div></h4>
              </Col>
              <Col xs>
                <h4><div className={css.cell}>Back</div></h4>
              </Col>
              <Col xs>
                <h4><div className={css.cell}>Front</div></h4>
              </Col>
              <Col xs>
                <h4><div className={css.cell}>Code Review</div></h4>
              </Col>
              <Col xs>
                <h4><div className={css.cell}>QA</div></h4>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123"><div className={classnames(css.cell, css.memberColumn)}>Бронислав Пупков</div></Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123"><div className={classnames(css.cell, css.memberColumn)}>Александра Одиннадцатиклассница</div></Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123"><div className={classnames(css.cell, css.memberColumn)}>Никита Джугашвили</div></Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123"><div className={classnames(css.cell, css.memberColumn)}>Николай Липотин</div></Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox" checked/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={css.memberRow}>
          <Col xs={3}>
            <Link to="/users/123"><div className={classnames(css.cell, css.memberColumn)}>Андрей Юдин</div></Link>
          </Col>
          <Col xs={9}>
            <Row>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
              <Col xs>
                <label className={css.cell}><input type="checkbox"/></label>
              </Col>
            </Row>
          </Col>
        </Row>
        <Button text="Добавить участника" type="primary" style={{marginTop: 16}} icon="IconPlus"/>
        <hr/>
        <h3>Спринты / Фазы</h3>
        <Row>
          <Col xs={3}>
            <SprintCard/>
          </Col>
          <Col xs={3}>
            <SprintCard/>
          </Col>
          <Col xs={3}>
            <SprintCard/>
          </Col>
        </Row>
        <Button text="Создать спринт" type="primary" style={{marginTop: 16}} icon="IconPlus"/>
      </div>
    );
  }
}
