import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import * as css from './Participant.scss';
import { IconClose } from '../Icons';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Checkbox from '../../components/Checkbox';
import { connect } from 'react-redux';
import { bindUserToProject, unbindUserToProject } from '../../actions/Project';
import ConfirmModal from '../ConfirmModal';
import { showNotification } from '../../actions/Notifications';
import localize from './Participant.json';
import { getFullName } from '../../utils/NameLocalisation';
import Button from '../Button';
import Modal from '../Modal';
import SelectDropdown from '../SelectDropdown';
import DatepickerDropdown from '../DatepickerDropdown';

class Participant extends React.Component {
  static defaultProps = {
    isExternal: false
  };

  constructor(props) {
    super(props);
    this.ROLES_NAME = [
      'account',
      'pm',
      'ux',
      'analyst',
      'back',
      'front',
      'mobile',
      'teamLead',
      'qa',
      'unbillable',
      'android',
      'ios',
      'devops'
    ];
    this.ROLES_ID = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '13', '14'];
    this.state = {
      sendRoles: []
    };
  }

  componentWillMount = () => {
    this.setState({ sendRoles: this.setRoles(this.props) });
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ sendRoles: this.setRoles(nextProps) });
  };

  changeRole = (e, role, roleId) => {
    e.preventDefault();
    const oldRoles = this.state.sendRoles;
    const isDeleteRole = oldRoles.includes(roleId);
    const newRoles = isDeleteRole ? oldRoles.filter(oldRoleId => oldRoleId !== roleId) : oldRoles.concat(roleId);
    if (newRoles.length) {
      const stringRoles = newRoles.join(',');
      this.setState({ sendRoles: newRoles }, () => {
        this.props.bindUserToProject(this.props.projectId, this.props.user.id, stringRoles);
      });
    } else {
      this.props.showNotification({
        message: localize[this.props.lang].MESSAGE,
        type: 'error'
      });
    }
  };

  changeGitlabRole = (option, attr) => {
    this.setState({
      editingGitlabRole: {
        ...this.state.editingGitlabRole,
        [attr]: moment.isMoment(option) ? option : option.value
      }
    });
  };

  saveGitlabRole = e => {
    e.preventDefault();
    const { editingGitlabRoleForProjectId, editingGitlabRole, sendRoles } = this.state;
    const { projectId } = this.props;
    const gitLabRole = this.getProjectUserGitlabRole(editingGitlabRoleForProjectId);
    if (
      editingGitlabRole.accessLevel !== gitLabRole.accessLevel ||
      editingGitlabRole.expiresAt !== gitLabRole.expiresAt
    ) {
      this.props.bindUserToProject(projectId, this.props.user.id, sendRoles.join(','), [
        {
          ...editingGitlabRole,
          gitlabProjectId: editingGitlabRoleForProjectId
        }
      ]);
    }
    this.handleCloseGitlabRoleEdit();
  };

  getProjectUserGitlabRole(projectId) {
    const { user, gitlabRoles } = this.props;
    const defaultLabel = localize[this.props.lang].UNSET_GITLAB_USER_ROLE;
    if (user.gitlabRoles && user.gitlabRoles.length) {
      const userGitlabRole = user.gitlabRoles.find(({ gitlabProjectId }) => gitlabProjectId === projectId) || {};
      const { label, ...gitlabRoleParams } = gitlabRoles.find(({ value }) => value === userGitlabRole.accessLevel);
      return {
        ...userGitlabRole,
        label: label || defaultLabel,
        ...gitlabRoleParams
      };
    }
    return { label: defaultLabel };
  }

  unbindUser = () => {
    const { projectId, user, isExternal } = this.props;
    this.setState({ isConfirmDeleteOpen: false }, () => this.props.unbindUserToProject(projectId, user.id, isExternal));
  };

  setRoles = prop => {
    const sendRoles = [];

    for (const key in prop.user.roles) {
      if (prop.user.roles[key]) {
        sendRoles.push(this.ROLES_ID[this.ROLES_NAME.indexOf(key)]);
      }
    }

    return sendRoles;
  };

  handleOpenGitlabRoleEdit = projectId => {
    this.setState({
      editingGitlabRoleForProjectId: projectId,
      editingGitlabRole: this.getProjectUserGitlabRole(projectId)
    });
  };

  handleCloseGitlabRoleEdit = () => {
    this.setState({
      editingGitlabRoleForProjectId: null,
      editingGitlabRole: {}
    });
  };

  handleOpenConfirmDelete = event => {
    event.stopPropagation();
    this.setState({ isConfirmDeleteOpen: true });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ isConfirmDeleteOpen: false });
  };

  render() {
    const { user, isExternal, lang, gitlabProjects } = this.props;
    const { editingGitlabRole } = this.state;

    const roles = user.roles;
    return (
      <Row className={css.memberRow}>
        <Col
          xs={12}
          sm={2}
          md={2}
          lg={3}
          style={
            isExternal
              ? {
                  maxWidth: '100%',
                  flexBasis: '100%'
                }
              : null
          }
        >
          <div className={classnames(css.cell, css.memberColumn)}>
            {this.props.isProjectAdmin ? (
              <IconClose className={css.iconClose} onClick={this.handleOpenConfirmDelete} />
            ) : null}
            {getFullName(user)}
          </div>
        </Col>
        {!isExternal ? (
          <Col xs={12} sm={10} md={10} lg={9}>
            <Row>
              {gitlabProjects.map(({ id, name }) => (
                <Col key={id} xs={6} sm={3} md={3} lg className={css.cellColumn}>
                  <div className={classnames(css.cell, css.gitlabRoleCellWrap)}>
                    <div className={classnames(css.gitlabRoleCell)}>
                      <a onClick={() => this.handleOpenGitlabRoleEdit(id)}>
                        {this.getProjectUserGitlabRole(id).label}
                        <span className={classnames(css.gitlabRoleProjectName)}> / {name}</span>
                      </a>
                    </div>
                  </div>
                </Col>
              ))}
              {this.ROLES_NAME
                ? this.ROLES_NAME.map((ROLES_NAME, i) => (
                    <Col xs={6} sm={3} md={3} lg key={`${i}-roles-checkbox`} className={css.cellColumn}>
                      <label className={css.cell}>
                        <Checkbox
                          disabled={!this.props.isProjectAdmin}
                          onChange={e => this.changeRole(e, this.ROLES_NAME[i], this.ROLES_ID[i])}
                          checked={(roles && roles[ROLES_NAME]) || false}
                        />
                        <span className={classnames(css.labelText, { [css.toUp]: ROLES_NAME === 'ios' })}>
                          {this.ROLES_NAME[i] === 'devops' ? 'DevOps' : this.ROLES_NAME[i]}
                        </span>
                      </label>
                    </Col>
                  ))
                : null}
            </Row>
          </Col>
        ) : null}
        {this.state.isConfirmDeleteOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={`${localize[lang].DELETE} ${getFullName(user)}?`}
            lang={lang}
            onCancel={this.handleCloseConfirmDelete}
            onConfirm={this.unbindUser}
            onRequestClose={this.handleCloseConfirmDelete}
          />
        ) : null}
        {this.state.editingGitlabRoleForProjectId ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseGitlabRoleEdit}>
            <form className={css.changeStage}>
              <h3>{localize[lang].EDIT_GITLAB_ROLE}</h3>
              <div>
                <div className={css.gitlabRoleParams}>
                  <SelectDropdown
                    name="access_level"
                    placeholder={localize[lang].SELECT_GITLAB_ROLE}
                    value={editingGitlabRole.accessLevel}
                    onChange={value => this.changeGitlabRole(value, 'accessLevel')}
                    noResultsText={localize[lang].NO_RESULTS}
                    backspaceToRemoveMessage={''}
                    options={this.props.gitlabRoles}
                  />
                  <DatepickerDropdown
                    name="expires_at"
                    value={editingGitlabRole.expiresAt ? moment(editingGitlabRole.expiresAt).format('DD.MM.YYYY') : ''}
                    onDayChange={value => this.changeGitlabRole(value, 'expiresAt')}
                    placeholder={localize[lang].SELECT_DATA}
                  />
                </div>
                <Button
                  type="green"
                  text={localize[lang].SAVE_GITLAB_ROLE}
                  onClick={this.saveGitlabRole}
                  htmlType="submit"
                  disabled={!editingGitlabRole.accessLevel}
                />
              </div>
            </form>
          </Modal>
        ) : null}
      </Row>
    );
  }
}

Participant.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  gitlabProjects: PropTypes.arrayOf(PropTypes.object),
  gitlabRoles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string
    })
  ),
  isExternal: PropTypes.bool,
  isProjectAdmin: PropTypes.bool,
  lang: PropTypes.string,
  projectId: PropTypes.number,
  showNotification: PropTypes.func,
  unbindUserToProject: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  bindUserToProject,
  unbindUserToProject,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Participant);
