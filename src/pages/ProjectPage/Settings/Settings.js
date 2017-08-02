import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import axios from 'axios';
import { createSprint } from '../../../actions/Sprint';
import CreateSprintModal from '../CreateSprintModal';
import { API_URL } from '../../../constants/Settings';
import { bindUserToProject } from '../../../actions/Project';

import * as css from './Settings.scss';
import Participant from '../../../components/Participant';
import SprintCard from '../../../components/SprintCard';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import SelectDropdown from '../../../components/SelectDropdown';

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
      allottedTime: null,
      participant: null,
      participants: []
    };
  }

  bindUser = () => {
    this.setState({ isModalOpenAddUser: false });
    this.setState({participants: []});
    this.setState({participant: null});
    this.props.bindUserToProject(
      this.props.id,
      this.state.participant.value
    );
  };

  searchOnChange = (name) => {
    const userName = name.trim();
    if (userName.length > 1) {
      const URL = `${API_URL}/user/autocompleter/?userName=${userName}`;
      axios
        .get(URL, {})
        .then(response => {
          if (response.data) {
            this.setState({participants: response.data});
          }
        });
    } else {
      this.setState({participants: []});
    }
  };

  getUsers = () => {
    return this.state.participants.map((user) => ({
      value: user.id,
      label: user.fullNameRu
    }));
  };

  selectValue = (e) => {
    this.setState({participant: e});
  };

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
    this.setState({participants: []});
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
                       key={`${user.id}-user`}
                       projectId={this.props.id}/>
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
            <div className={css.changeStage}>
              <h3>Добавление нового участника</h3>
              <div className={css.modalLine}>
                <SelectDropdown
                  name="member"
                  placeholder="Введите имя участника..."
                  multi={false}
                  value={this.state.participant}
                  onChange={e => this.selectValue(e)}
                  onInputChange={this.searchOnChange}
                  noResultsText="Нет результатов"
                  options={this.getUsers()}
                />
                <Button type="green"
                        text="Добавить"
                        onClick={this.bindUser}/>
              </div>
            </div>
          </Modal>
            : null
        }
        {
          this.state.isModalOpenAddSprint
            ? <CreateSprintModal onClose={this.handleCloseModalAddSprint} />
            : null
        }
      </div>
    );
  }
}

Settings.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
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
  bindUserToProject,
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
