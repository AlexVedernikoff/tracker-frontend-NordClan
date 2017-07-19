import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { createSprint } from '../../../actions/Sprint';
import CreateSprintModal from '../CreateSprintModal';

import * as css from './Settings.scss';
import SprintCard from '../../../components/SprintCard';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';

class Settings extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  render () {

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
        {this.props.sprints
          ? <div>
              <hr />
              <h2>Спринты / Фазы</h2>
              <Row>
                {this.props.sprints.map((element, i) =>
                  <Col xs={3} key={`sprint-${i}`}>
                    <SprintCard sprint={element} />
                  </Col>
                )}
              </Row>
            </div>
          : null}
        <Button
          text="Создать спринт"
          type="primary"
          style={{ marginTop: 16 }}
          icon="IconPlus"
          onClick={this.handleOpenModal}
        />
        {
          this.state.isModalOpen
          ? <CreateSprintModal onClose={this.handleCloseModal} />
          : null
        }
      </div>
    );
  }
}

Settings.propTypes = {
  sprints: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(Settings);
