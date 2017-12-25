import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../../../constants/Settings';
import { ADMIN } from '../../../../constants/Roles';
import { bindUserToProject } from '../../../../actions/Project';
import { debounce } from 'lodash';
import ReactTooltip from 'react-tooltip';
import * as css from './ParticipantEditor.scss';
import Participant from '../../../../components/Participant';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import SelectDropdown from '../../../../components/SelectDropdown';

class ParticipantEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpenAddUser: false,
      participant: null,
      participants: []
    };
    this.ROLES_FULL_NAME = ['Account', 'PM', 'UX', 'Analyst', 'Back', 'Front', 'Mobile', 'TeamLead', 'QA', 'Unbillable'];
    // временная заглушка, пока нет конкретного списка прав по ролям
    this.roleRights = {
      PM: 'Доступны все действия на уровне проекта',
      default: 'Доступно CRU(без delete) всего на уровне проекта, в который добавлен'
    };
    this.searchOnChange = debounce(this.searchOnChange, 400);
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  componentWillUnmount = () => {
    this.searchOnChange.cancel();
  };

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
            response.data = response.data.filter((participant) => {
              let triger = false;
              this.props.users.forEach((user) => {
                if (participant.id === user.id) {
                  triger = true;
                }
              });
              return !triger ? participant : undefined;
            });
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

  getRoleRights = (role, rights) => {
    return rights[role] || rights.default;
  };

  handleOpenModalAddUser = () => {
    this.setState({ isModalOpenAddUser: true });
  };

  handleCloseModalAddUser = () => {
    this.setState({ isModalOpenAddUser: false });
    this.setState({participants: []});
  };

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.id) !== -1
      || this.props.user.globalRole === ADMIN;
  };

  render () {
    const isProjectAdmin = this.checkIsAdminInProject();

    return (
      <div className={css.property}>
        <h2>Участники</h2>
        <Row className={classnames(css.memberRow, css.memberHeader)}>
          <Col xs={9} xsOffset={3}>
            <Row>
              {
                this.ROLES_FULL_NAME
                  ? this.ROLES_FULL_NAME.map((ROLES_FULL_NAME, i) =>
                    <Col xs lg key={`${i}-roles-name`}>
                      <h4>
                        <div className={css.cell}>
                          {ROLES_FULL_NAME}
                          <div className = {css.rightsInfo} data-tip={this.getRoleRights(ROLES_FULL_NAME, this.roleRights)}>
                            i
                          </div>
                        </div>
                      </h4>
                    </Col>
                  )
                  : null
              }
            </Row>
          </Col>
        </Row>
        {
          this.props.users
            ? this.props.users.map((user) =>
              <Participant user={user}
                key={`${user.id}-user`}
                projectId={this.props.id}
                isProjectAdmin={isProjectAdmin}
              />
            )
            : null
        }
        {
          isProjectAdmin
            ? <Button
              text="Добавить участника"
              type="primary"
              style={{ marginTop: 16 }}
              icon="IconPlus"
              onClick={this.handleOpenModalAddUser}
            />
            : null
        }
        {
          this.state.isModalOpenAddUser
            ? <Modal
              isOpen
              contentLabel="modal"
              onRequestClose={this.handleCloseModalAddUser}
            >
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
                    autofocus
                  />
                  <Button
                    type="green"
                    text="Добавить"
                    onClick={this.bindUser}
                  />
                </div>
              </div>
            </Modal>
            : null
        }
      </div>
    );
  }
}

ParticipantEditor.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  id: PropTypes.number,
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  id: state.Project.project.id,
  users: state.Project.project.users,
  user: state.Auth.user
});

const mapDispatchToProps = {
  bindUserToProject
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantEditor);
