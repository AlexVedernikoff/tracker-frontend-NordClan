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
import layoutAgnosticFilter from '../../../../utils/layoutAgnosticFilter';
import Wizard from '../../../../components/Wizard';
import { getFullName } from '../../../../utils/NameLocalisation';
import { createSelector } from 'reselect';
import { getGitlabRoles } from '../../../../actions/Dictionaries';

function getEmptyState() {
  return {
    roles: [],
    participants: [],
    participant: null,
    gitlabProjects: [],
    gitlabRoles: {}
  };
}

class ParticipantEditor extends Component {
  constructor(props) {
    super(props);
    const { lang } = props;
    this.state = {
      isModalOpenAddUser: false,
      isModalOpenAddExternal: false,
      isModalOpenWizard: false,
      ...getEmptyState()
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
    this.props.getGitlabRoles();
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

  bindUser = e => {
    e.preventDefault();

    const { id } = this.props;
    const { participant, roles, gitlabRoles } = this.state;
    const rolesIds = roles.map(role => role.value).join(',');
    const gitlabRolesIds = gitlabRoles.map(({ id: roleId }) => roleId).join(',');
    this.props.bindUserToProject(id, participant.value, rolesIds, gitlabRolesIds);
    this.setState({
      isModalOpenAddUser: false,
      ...getEmptyState()
    });
  };

  bindExternal = e => {
    e.preventDefault();

    const { id } = this.props;
    const { participant } = this.state;
    this.props.bindUserToProject(id, participant.value, '11');
    this.setState({
      isModalOpenAddExternal: false,
      ...getEmptyState()
    });
  };

  searchOnChange = name => {
    const userName = name.trim();
    if (userName.length > 1) {
      /** TODO вынести в actions */
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
    } else if (this.state.participants.length > 0) {
      this.setState({ participants: [] });
    }
  };

  searchExternalOnChange = name => {
    const userName = name.trim();
    if (userName.length > 1) {
      /** TODO вынести в actions */
      const URL = `${API_URL}/user/autocompleter/external/?userName=${userName}`;
      axios.get(URL, {}).then(response => {
        if (response.data) {
          const userIds = this.props.externalUsers.map(user => user.id);
          const newParticipantsState = response.data.filter(participant => !userIds.includes(participant.id));
          this.setState({ participants: newParticipantsState });
        }
      });
    } else if (this.state.participants.length > 0) {
      this.setState({ participants: [] });
    }
  };

  getUsers = () => {
    return this.state.participants.map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
  };

  getGitlabProjectsOptions() {
    return this.props.gitlabProjects.map(({ id, name }) => ({
      value: id,
      label: name
    }));
  }

  selectGitlabProject() {
    return option => {
      this.setState(state => ({
        gitlabProjects: option,
        gitlabRoles: option.reduce((acc, { id }) => {
          if (state.gitlabRoles[id]) {
            acc[id] = state.gitlabRoles[id];
          }
          return acc;
        }, {})
      }));
    };
  }

  getGitlabRolesOptions() {
    return this.props.gitlabRoles.map(({ id, name }) => ({
      value: id,
      label: name
    }));
  }

  selectGitlabRole(projectId) {
    return option => {
      this.setState(state => ({
        gitlabRoles: {
          ...state.gitlabRoles,
          [projectId]: option
        }
      }));
    };
  }

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

  handleOpenModalWizard = () => {
    this.setState({
      isModalOpenWizard: true
    });
  };

  handleCloseModalWizard = () => {
    this.setState({
      isModalOpenWizard: false
    });
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
      ...getEmptyState()
    });
  };
  handleCloseModalAddExternal = () => {
    this.setState({
      isModalOpenAddExternal: false,
      ...getEmptyState()
    });
  };

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.id) !== -1) ||
      this.props.user.globalRole === ADMIN
    );
  };

  render() {
    const { lang, gitlabProjects } = this.props;
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
          {this.disableButton() ? (
            <Button
              text={localize[lang].ADD_EXTERNAL_USERS}
              type="primary"
              addedClassNames={{ [css.addButton]: true }}
              icon="IconPlus"
              onClick={this.handleOpenModalAddExternal}
            />
          ) : null}
        </div>
        {/* скрыл блок в соответсвии с задаче ST-12647 */}
        {/*<div className={css.externalUsers}>*/}
        {/*<h2>{localize[lang].SYNCHRONIZATION_WITH_JIRA}</h2>*/}
        {/*<Button*/}
        {/*onClick={this.handleOpenModalWizard}*/}
        {/*text={localize[lang].CREATE_PROJECT_WITH_JIRA}*/}
        {/*type="primary"*/}
        {/*icon="IconPlus"*/}
        {/*/>*/}
        {/*</div>*/}
        {this.state.isModalOpenAddUser ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalAddUser}>
            <form className={css.changeStage}>
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
                  autoFocus
                  filterOption={el => el}
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
                {gitlabProjects.length ? (
                  <SelectDropdown
                    name="gitlabProjects"
                    placeholder={localize[lang].SELECT_GITLAB_PROJECT}
                    multi
                    value={this.state.gitlabProjects}
                    onChange={this.selectGitlabProject()}
                    noResultsText={localize[lang].NO_RESULTS}
                    backspaceToRemoveMessage={''}
                    options={this.getGitlabProjectsOptions()}
                  />
                ) : null}
                {this.state.gitlabProjects.length
                  ? this.state.gitlabProjects.map(({ label: name, value: id }) => (
                      <label key={id} className={css.gitlabRoleLabel}>
                        {name}:
                        <SelectDropdown
                          name="gitlabRoles"
                          placeholder={localize[lang].SELECT_GITLAB_ROLE}
                          value={this.state.gitlabRoles[id]}
                          onChange={this.selectGitlabRole(id)}
                          noResultsText={localize[lang].NO_RESULTS}
                          backspaceToRemoveMessage={''}
                          options={this.getGitlabRolesOptions()}
                        />
                      </label>
                    ))
                  : null}
                <Button
                  type="green"
                  text={localize[lang].ADD}
                  onClick={this.bindUser}
                  htmlType="submit"
                  disabled={!(this.state.participant && this.state.roles.length)}
                />
              </div>
            </form>
          </Modal>
        ) : null}
        {this.state.isModalOpenAddExternal ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalAddExternal}>
            <form className={css.changeStage}>
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
                  autoFocus
                  filterOption={layoutAgnosticFilter}
                />
                <Button
                  type="green"
                  text={localize[lang].ADD}
                  onClick={this.bindExternal}
                  disabled={!this.state.participant}
                  htmlType="submit"
                />
              </div>
            </form>
          </Modal>
        ) : null}
        <Wizard lang={lang} isOpen={this.state.isModalOpenWizard} onRequestClose={this.handleCloseModalWizard} />
      </div>
    );
  }
}

ParticipantEditor.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  externalUsers: PropTypes.array,
  getGitlabRoles: PropTypes.func,
  getProjectUsers: PropTypes.func,
  gitlabProjects: PropTypes.array,
  gitlabRoles: PropTypes.array,
  id: PropTypes.number,
  lang: PropTypes.string.isRequired,
  projectAuthorId: PropTypes.number,
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

const gitLabProjectsSelector = createSelector(
  state => state.Project.project,
  project => {
    return project ? project.gitlabProjects : [];
  }
);

const mapStateToProps = state => ({
  id: state.Project.project.id,
  users: state.Project.project.users,
  externalUsers: state.Project.project.externalUsers,
  user: state.Auth.user,
  projectAuthorId: state.Project.project.authorId,
  lang: state.Localize.lang,
  gitlabRoles: state.Dictionaries.gitlabRoles,
  gitlabProjects: gitLabProjectsSelector(state)
});

const mapDispatchToProps = {
  bindUserToProject,
  getProjectUsers,
  getGitlabRoles
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantEditor);
