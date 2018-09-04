import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../../../constants/Settings';
import { ADMIN } from '../../../../constants/Roles';
import { bindUserToProject, getProjectUsers } from '../../../../actions/Project';
import debounce from 'lodash/debounce';
import ReactTooltip from 'react-tooltip';
import * as css from './ParticipantEditor.scss';
import Participant from '../../../../components/Participant';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import SelectDropdown from '../../../../components/SelectDropdown';
import localize from './participantEditor.json';

class ParticipantEditor extends Component {
  constructor(props) {
    super(props);
    const { lang } = props;
    this.state = {
      isModalOpenAddUser: false,
      isModalOpenAddExternal: false,
      participant: null,
      roles: [],
      participants: []
    };
    this.ROLES_FULL_NAME = [
      'Account',
      'PM',
      'UX',
      'Analyst',
      'Back',
      'Front',
      'Mobile',
      'TeamLead',
      'QA',
      'Unbillable',
      'Android',
      'IOS',
      'DevOps'
    ];
    this.ROLES_ID = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '13', '14'];
    this.roleRights = {
      fullAccess: localize[lang].FULL_ACCESS,
      devAccess: localize[lang].DEV_ACCESS,
      qaAccess: localize[lang].QA_ACCESS,
      unbillableAccess: localize[lang].UNPAID_ROLE,
      external: localize[lang].EXTERNAL
    };
    this.searchOnChange = debounce(this.searchOnChange, 400);
  }

  componentDidMount() {
    addEventListener('keydown', this.handleEscClose, true);
    if (this.props.id) {
      this.props.getProjectUsers(this.props.id, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.getProjectUsers(nextProps.id, true);
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount = () => {
    this.searchOnChange.cancel();
    removeEventListener('keydown', this.handleEscClose);
  };

  handleEscClose = e => {
    const esc = e.keyCode === 27;
    if (esc && this.state.isModalOpenAddUser) {
      e.preventDefault();
      this.handleCloseModalAddUser();
    }
  };

  bindUser = () => {
    const { id, bindUserToProject } = this.props;
    const { participant, roles } = this.state;
    const rolesIds = roles.map(role => role.value).join(',');
    bindUserToProject(id, participant.value, rolesIds);
    this.setState({
      roles: [],
      isModalOpenAddUser: false,
      participants: [],
      participant: null
    });
  };

  bindExternal = () => {
    const { id, bindUserToProject } = this.props;
    const { participant } = this.state;
    bindUserToProject(id, participant.value, '11');
    this.setState({
      roles: [],
      isModalOpenAddExternal: false,
      participants: [],
      participant: null
    });
  };

  searchOnChange = name => {
    const userName = name.trim();
    if (userName.length > 1) {
      const URL = `${API_URL}/user/autocompleter/?userName=${userName}`;
      axios.get(URL, {}).then(response => {
        if (response.data) {
          response.data = response.data.filter(participant => {
            let triger = false;
            this.props.users.forEach(user => {
              if (participant.id === user.id) {
                triger = true;
              }
            });
            return !triger ? participant : undefined;
          });
          this.setState({ participants: response.data });
        }
      });
    } else {
      this.setState({ participants: [] });
    }
  };

  searchExternalOnChange = name => {
    const userName = name.trim();
    if (userName.length > 1) {
      const URL = `${API_URL}/user/autocompleter/external/?userName=${userName}`;
      axios.get(URL, {}).then(response => {
        if (response.data) {
          const userIds = this.props.externalUsers.map(user => user.id);
          const newParticipantsState = response.data.filter(participant => !userIds.includes(participant.id));
          this.setState({ participants: newParticipantsState });
        }
      });
    } else {
      this.setState({ participants: [] });
    }
  };

  getUsers = () => {
    return this.state.participants.map(user => ({
      value: user.id,
      label: user.fullNameRu
    }));
  };

  getRolesOptions = () => {
    return this.ROLES_FULL_NAME.map((role, i) => ({
      value: this.ROLES_ID[i],
      label: role
    }));
  };

  selectNewParticipantValue = key => {
    return option => {
      this.setState({ [key]: option });
    };
  };

  getRoleRights = (role, rights) => {
    if (role === 'Account' || role === 'PM') {
      return rights.fullAccess;
    }
    if (role === 'QA') {
      return rights.qaAccess;
    }
    if (role === 'Unbillable') {
      return rights.unbillableAccess;
    }
    if (role === 'Customer') {
      return rights.external;
    }
    return rights.devAccess;
  };

  handleOpenModalAddUser = () => {
    this.setState({ isModalOpenAddUser: true });
  };

  handleOpenModalAddExternal = () => {
    this.setState({ isModalOpenAddExternal: true });
  };

  checkIsPmInProject = () =>
    this.props.users.some(user => {
      if (user.id === this.props.user.id) {
        return user.roles.pm;
      }
    });

  checkIsAuthorProject = () => this.props.user.id === this.props.projectAuthorId;

  disableButton = () => this.checkIsAdminInProject() || this.checkIsPmInProject() || this.checkIsAuthorProject();

  handleCloseModalAddUser = () => {
    this.setState({
      isModalOpenAddUser: false,
      participants: [],
      roles: []
    });
  };
  handleCloseModalAddExternal = () => {
    this.setState({
      isModalOpenAddExternal: false,
      participants: [],
      participant: null
    });
  };

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.id) !== -1) ||
      this.props.user.globalRole === ADMIN
    );
  };

  render() {
    const { lang } = this.props;
    const isProjectAdmin = this.checkIsAdminInProject();
    return (
      <div className={css.property}>
        <h2>{localize[lang].PARTICIPANTS}</h2>
        <Row className={classnames(css.memberRow, css.memberHeader)}>
          <Col xs={9} xsOffset={3}>
            <Row>
              {this.ROLES_FULL_NAME
                ? this.ROLES_FULL_NAME.map((ROLES_FULL_NAME, i) => (
                    <Col xs lg key={`${i}-roles-name`}>
                      <h4>
                        <div className={css.cell}>
                          <div
                            className={css.rightsInfo}
                            data-html="true"
                            data-tip={this.getRoleRights(ROLES_FULL_NAME, this.roleRights)}
                          >
                            <span>{ROLES_FULL_NAME}</span>
                          </div>
                        </div>
                      </h4>
                    </Col>
                  ))
                : null}
            </Row>
          </Col>
        </Row>
        {this.props.users
          ? this.props.users.map(user => (
              <Participant
                user={user}
                key={`${user.id}-user`}
                projectId={this.props.id}
                isProjectAdmin={isProjectAdmin}
              />
            ))
          : null}
        {this.disableButton() ? (
          <Button
            text={localize[lang].ADD_MEMBERS}
            type="primary"
            addedClassNames={{ [css.addButton]: true }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddUser}
          />
        ) : null}
        <div className={css.externalUsers}>
          <h2>{localize[lang].EXTERNAL_USERS}</h2>
          <div className={css.externalTable}>
            {/* <Row className={classnames(css.memberRow, css.memberHeader)} /> */}
            {this.props.externalUsers
              ? this.props.externalUsers.map(user => (
                  <Participant
                    user={user}
                    key={`${user.id}-exUser`}
                    projectId={this.props.id}
                    isProjectAdmin={isProjectAdmin}
                    isExternal
                  />
                ))
              : null}
          </div>
          <Button
            text={localize[lang].ADD_EXTERNAL_USERS}
            type="primary"
            addedClassNames={{ [css.addButton]: true }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddExternal}
          />
        </div>
        {this.state.isModalOpenAddUser ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalAddUser}>
            <div className={css.changeStage}>
              <h3>{localize[lang].ADD_NEW_MEMBERS}</h3>
              <div className={css.modalContainer}>
                <SelectDropdown
                  name="member"
                  placeholder={localize[lang].ENTER_NAME_PARTICIPANT}
                  multi={false}
                  value={this.state.participant}
                  onChange={this.selectNewParticipantValue('participant')}
                  onInputChange={this.searchOnChange}
                  noResultsText={localize[lang].NO_RESULTS}
                  options={this.getUsers()}
                  autofocus
                />
                <SelectDropdown
                  name="roles"
                  placeholder={localize[lang].ENTER_ROLE_PARTICIPANT}
                  multi
                  value={this.state.roles}
                  onChange={this.selectNewParticipantValue('roles')}
                  noResultsText={localize[lang].NO_RESULTS}
                  backspaceToRemoveMessage={''}
                  options={this.getRolesOptions()}
                />
                <Button
                  type="green"
                  text={localize[lang].ADD}
                  onClick={this.bindUser}
                  disabled={!(this.state.participant && this.state.roles.length)}
                />
              </div>
            </div>
          </Modal>
        ) : null}
        {this.state.isModalOpenAddExternal ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalAddExternal}>
            <div className={css.changeStage}>
              <h3>{localize[lang].ADD_EXTERNAL_USERS}</h3>
              <div className={css.modalContainer}>
                <SelectDropdown
                  name="member"
                  placeholder={localize[lang].ENTER_EXTERNAL_USERS}
                  multi={false}
                  value={this.state.participant}
                  onChange={this.selectNewParticipantValue('participant')}
                  onInputChange={this.searchExternalOnChange}
                  noResultsText={localize[lang].NO_RESULTS}
                  options={this.getUsers()}
                  autofocus
                />
                <Button
                  type="green"
                  text={localize[lang].ADD}
                  onClick={this.bindExternal}
                  disabled={!this.state.participant}
                />
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

ParticipantEditor.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  externalUsers: PropTypes.array,
  getProjectUsers: PropTypes.func,
  id: PropTypes.number,
  lang: PropTypes.string.isRequired,
  projectAuthorId: PropTypes.number,
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  id: state.Project.project.id,
  users: state.Project.project.users,
  externalUsers: state.Project.project.externalUsers,
  user: state.Auth.user,
  projectAuthorId: state.Project.project.authorId,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  bindUserToProject,
  getProjectUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantEditor);
