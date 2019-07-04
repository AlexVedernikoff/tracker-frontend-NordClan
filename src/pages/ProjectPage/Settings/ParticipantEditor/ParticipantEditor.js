import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
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
import { getFullName } from '../../../../utils/NameLocalisation';
import JiraEditor from '../JiraEditor/JiraEditor';
import { gitLabProjectsSelector, localizedGitlabRolesSelector } from '../../../../selectors/Project';
import DatepickerDropdown from '../../../../components/DatepickerDropdown';

function getEmptyState() {
  return {
    roles: [],
    participants: [],
    participant: null,
    gitlabProjects: [],
    selectedGitlabRoles: {}
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
      tabIndex: 1,
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
    if (this.props.id) {
      this.props.getProjectUsers(this.props.id, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.getProjectUsers(nextProps.id, true);
      this.handleChangeTab(1);
    }
    if (nextProps.gitlabProjects.length && this.state.tabIndex === 1) {
      this.handleChangeTab(1);
    } else if (!nextProps.gitlabProjects.length && this.state.tabIndex === 0) {
      this.handleChangeTab(0);
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentWillUnmount() {
    this.searchOnChange.cancel();
    removeEventListener('keydown', this.handleEscClose);
  }

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
    const { participant, roles, selectedGitlabRoles } = this.state;
    const rolesIds = roles.map(role => role.value).join(',');
    const gitlabRolesArray = Object.keys(selectedGitlabRoles).map(gitlabProjectId => ({
      accessLevel: selectedGitlabRoles[gitlabProjectId].role.value,
      expiresAt: selectedGitlabRoles[gitlabProjectId].expiresAt,
      gitlabProjectId
    }));
    this.props.bindUserToProject(id, participant.value, rolesIds, gitlabRolesArray);
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
        selectedGitlabRoles: option.reduce((acc, { id }) => {
          if (state.selectedGitlabRoles[id]) {
            acc[id] = state.selectedGitlabRoles[id];
          }
          return acc;
        }, {})
      }));
    };
  }

  getGitlabRoleParam(projectId, key) {
    const { selectedGitlabRoles } = this.state;
    return selectedGitlabRoles[projectId] ? selectedGitlabRoles[projectId][key] : null;
  }

  selectGitlabRoleParam(projectId, key) {
    return option => {
      this.setState(state => ({
        selectedGitlabRoles: {
          ...state.selectedGitlabRoles,
          [projectId]: {
            ...state.selectedGitlabRoles[projectId],
            [key]: moment.isMoment(option) ? option : option
          }
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

  handleChangeTab = index => {
    this.setState({ tabIndex: index });
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

  isAllGitlabRolesParamsSelected() {
    const { gitlabProjects, selectedGitlabRoles } = this.state;
    return gitlabProjects.every(
      ({ value: projectId }) => selectedGitlabRoles[projectId] && selectedGitlabRoles[projectId].role
    );
  }

  render() {
    const { lang, gitlabProjects, gitlabRoles, projectCompletedAt } = this.props;
    const isProjectAdmin = this.checkIsAdminInProject();
    return (
      <div className={css.property}>
        <Row>
          <Col xs={3}>
            <h2>{localize[lang].PARTICIPANTS}</h2>
          </Col>
          <Col xs={9}>
            <div className={css.tabs}>
              <div
                className={classnames(css.tab, { [css.tabActive]: this.state.tabIndex === 1 })}
                onClick={() => this.handleChangeTab(1)}
              >
                <p>[object Object]</p>
                <small>{localize[lang].PROJECT_ROLES}</small>
              </div>
              {gitlabProjects.length ? (
                <div
                  className={classnames(css.tab, { [css.tabActive]: this.state.tabIndex === 0 })}
                  onClick={() => this.handleChangeTab(0)}
                >
                  <p>GitLab</p>
                  <small>{localize[lang].ACCESS_REP}</small>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>

        <Row className={classnames(css.memberRow, css.memberHeader)}>
          <Col xs={9} xsOffset={3}>
            <Row>
              {this.state.tabIndex === 0 && gitlabProjects.length
                ? gitlabProjects.map(project => (
                    <Col xs lg key={project.id}>
                      <h4>
                        <div className={`${css.cell} ${css.gitlabProjectTableCaptionWrap}`}>
                          <div className={css.gitlabProjectTableCaption} data-tip={project.name}>
                            <span>
                              {gitlabProjects
                                .filter(item => item !== project)
                                .filter(item => item.name === project.name).length
                                ? project.name_with_namespace
                                : project.name}
                            </span>
                          </div>
                        </div>
                      </h4>
                    </Col>
                  ))
                : null}
              {this.ROLES_FULL_NAME && this.state.tabIndex === 1
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
                gitlabProjects={gitlabProjects}
                gitlabRoles={gitlabRoles}
                tabIndex={this.state.tabIndex}
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
        <JiraEditor />
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
                {gitlabProjects && gitlabProjects.length ? (
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
                      <div key={id}>
                        <div className={css.gitlabRoleProjectName}>{name}:</div>
                        <div className={css.gitlabRoleParams}>
                          <SelectDropdown
                            name="accessLevel"
                            placeholder={localize[lang].SELECT_GITLAB_ROLE}
                            value={this.getGitlabRoleParam(id, 'role') || ''}
                            onChange={this.selectGitlabRoleParam(id, 'role')}
                            noResultsText={localize[lang].NO_RESULTS}
                            backspaceToRemoveMessage={''}
                            options={gitlabRoles}
                          />
                          <DatepickerDropdown
                            name="expiresAt"
                            value={
                              this.getGitlabRoleParam(id, 'expiresAt')
                                ? moment(this.getGitlabRoleParam(id, 'expiresAt')).format('DD.MM.YYYY')
                                : projectCompletedAt
                                  ? moment(projectCompletedAt).format('DD.MM.YYYY')
                                  : ''
                            }
                            onDayChange={this.selectGitlabRoleParam(id, 'expiresAt')}
                            placeholder={localize[lang].SELECT_DATA}
                          />
                        </div>
                      </div>
                    ))
                  : null}
                <Button
                  type="green"
                  text={localize[lang].ADD}
                  onClick={this.bindUser}
                  htmlType="submit"
                  disabled={
                    !this.state.participant || !this.state.roles.length || !this.isAllGitlabRolesParamsSelected()
                  }
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
      </div>
    );
  }
}

ParticipantEditor.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  externalUsers: PropTypes.array,
  getProjectUsers: PropTypes.func,
  gitlabProjects: PropTypes.array,
  gitlabRoles: PropTypes.array,
  id: PropTypes.number,
  lang: PropTypes.string.isRequired,
  projectAuthorId: PropTypes.number,
  projectCompletedAt: PropTypes.string,
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  id: state.Project.project.id,
  users: state.Project.project.users,
  externalUsers: state.Project.project.externalUsers,
  user: state.Auth.user,
  projectAuthorId: state.Project.project.authorId,
  projectCompletedAt: state.Project.project.completedAt,
  lang: state.Localize.lang,
  gitlabProjects: gitLabProjectsSelector(state),
  gitlabRoles: localizedGitlabRolesSelector(state)
});

const mapDispatchToProps = {
  bindUserToProject,
  getProjectUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantEditor);
