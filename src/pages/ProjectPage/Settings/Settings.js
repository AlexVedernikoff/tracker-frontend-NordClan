import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { createSprint } from '../../../actions/Sprint';

import * as css from './Settings.scss';
import Participant from '../../../components/Participant';
import SprintCard from '../../../components/SprintCard';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import Input from '../../../components/Input';
import moment from 'moment';

class Settings extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpenAddSprint: false,
      isModalOpenAddUser: false,
      dateFrom: undefined,
      dateTo: undefined,
      sprintName: '',
      sprintTime: '',
      allottedTime: null
    };
  }

  handleOpenModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: true });
  };

  handleCloseModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: false });
  };

  handleOpenModalAddUser = () => {
    this.setState({ isModalOpenAddUser: true });
  };

  handleCloseModalAddUser = () => {
    this.setState({ isModalOpenAddUser: false });
  };

  onChangeTime = (e) => {
    this.setState({ allottedTime: e.target.value });
  };

  onChangeName = (e) => {
    this.setState({ sprintName: e.target.value });
  };

  handleDayFromChange = (date) => {
    this.setState({ dateFrom: moment(date).format('YYYY-MM-DD')});
  };

  handleDayToChange = (date) => {
    this.setState({ dateTo: moment(date).format('YYYY-MM-DD')});
  };

  createSprint = () => {
    this.setState({ isModalOpenAddSprint: false });
    this.props.createSprint(
        this.state.sprintName.trim(),
        this.props.id,
        this.state.dateFrom,
        this.state.dateTo,
        this.state.allottedTime
    );
  };

  render () {
    const formattedDayFrom = this.state.dateFrom
        ? moment(this.state.dateFrom).format('DD.MM.YYYY')
        : '';
    const formattedDayTo = this.state.dateTo
        ? moment(this.state.dateTo).format('DD.MM.YYYY')
        : '';

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
        {this.props.users
          ? this.props.users.map((user) =>
          <Participant user={user}
                       key={`${user.id}-user`}/>
        ) : null}
        <Button
          text="Добавить участника"
          type="primary"
          style={{ marginTop: 16 }}
          icon="IconPlus"
          onClick={this.handleOpenModalAddUser}
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
          onClick={this.handleOpenModalAddSprint}
        />
        {
          this.state.isModalOpenAddUser
            ? <Modal
            isOpen
            contentLabel="modal"
            onRequestClose={this.handleCloseModalAddUser}>
            <div>
              <div>
                <Row>
                  <Col xsOffset={1}
                       xs={10}>
                    <h3>Создание нового спринта</h3>
                    <Input
                      placeholder="Имя Фамилия..."
                      onChange={this.onChangeName}
                    />
                  </Col>
                </Row>
                <Row className={css.createButton}
                     center="xs">
                  <Col xs>
                    <Button type="green"
                            text="Добавить участника"
                            onClick={this.createSprint}/>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal>
            : null
        }
        {
          this.state.isModalOpenAddSprint
              ? <Modal
              isOpen
              contentLabel="modal"
              onRequestClose={this.handleCloseModalAddSprint}>
            <div>
              <div>
                <Row>
                  <Col xsOffset={1}
                       xs={10}>
                    <h3>Создание нового спринта</h3>
                    <Input
                        placeholder="Введите название спринта..."
                        onChange={this.onChangeName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <DatepickerDropdown
                        name="dateFrom"
                        value={formattedDayFrom}
                        onDayChange={this.handleDayFromChange}
                        placeholder="Дата начала"
                    />
                    <DatepickerDropdown
                        name="dateTo"
                        value={formattedDayTo}
                        onDayChange={this.handleDayToChange}
                        placeholder="Дата окончания"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xsOffset={1}
                       xs={10}>
                    <Input
                        placeholder="Введите время в часах..."
                        onChange={this.onChangeTime}
                    />
                  </Col>
                </Row>
                <Row className={css.createButton}
                     center="xs">
                  <Col xs>
                    <Button type="green"
                            text="Создать"
                            onClick={this.createSprint}/>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal>
              : null
        }
      </div>
    );
  }
}

Settings.propTypes = {
  createSprint: PropTypes.func.isRequired,
  id: PropTypes.number,
  sprints: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  id: state.Project.project.id,
  users: state.Project.project.users
});

const mapDispatchToProps = {
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
