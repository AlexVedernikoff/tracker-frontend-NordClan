import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Participant.scss';
import {IconClose} from '../Icons';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Checkbox from '../../components/Checkbox';
import {connect} from 'react-redux';
import { bindUserToProject, unbindUserToProject } from '../../actions/Project';
import ConfirmModal from '../ConfirmModal';
import { showNotification } from '../../actions/Notifications';
class Participant extends React.Component {
  constructor (props) {
    super(props);
    this.ROLES_NAME = ['account', 'pm', 'ux', 'analyst', 'back', 'front', 'mobile', 'teamLead', 'qa', 'unbillable'];
    this.ROLES_ID = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    this.state = {
      sendRoles: []
    };
  }

  componentWillMount = () => {
    this.setState({ sendRoles: this.setRoles(this.props) });
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({ sendRoles: this.setRoles(nextProps) });
  };

  changeRole = (e, role, roleId) => {
    e.preventDefault();
    const oldRoles = this.state.sendRoles;
    const isDeleteRole = oldRoles.includes(roleId);
    const newRoles = isDeleteRole ? oldRoles.filter(oldRoleId => oldRoleId !== roleId) : oldRoles.concat(roleId);
    if (newRoles.length) {
      const stringRoles = newRoles.join(',');
      this.setState(
        { sendRoles: newRoles },
        () => {
          this.props.bindUserToProject(
            this.props.projectId,
            this.props.user.id,
            stringRoles
          );
        }
      );
    } else {
      this.props.showNotification({
        message: 'Это единственная роль. Участник должен обладать хотя бы одной ролью',
        type: 'error'
      });
    }
  };

  unbindUser = () => {
    this.props.unbindUserToProject(
      this.props.projectId,
      this.props.user.id
    );
  };

  setRoles = (prop) => {
    const sendRoles = [];

    for (const key in prop.user.roles) {
      if (prop.user.roles[key]) {
        sendRoles.push(this.ROLES_ID[this.ROLES_NAME.indexOf(key)]);
      }
    }

    return sendRoles;
  };

  handleOpenConfirmDelete = event => {
    event.stopPropagation();
    this.setState({ isConfirmDeleteOpen: true });
  };

  handleCloseConfirmDelete = () => {
    this.setState({ isConfirmDeleteOpen: false });
  };

  render () {
    const {
      user,
      ...other
    } = this.props;

    const roles = user.roles;

    return (
      <Row className={css.memberRow}>
        <Col xs={12} sm={2} md={2} lg={3}>
          <div className={classnames(css.cell, css.memberColumn)}>
            {
              this.props.isProjectAdmin
                ? <IconClose
                  className={css.iconClose}
                  onClick={this.handleOpenConfirmDelete}
                />
                : null
            }
            {user.fullNameRu}
          </div>
        </Col>
        <Col xs={12} sm={10} md={10} lg={9}>
          <Row>
            {
              this.ROLES_NAME
                ? this.ROLES_NAME.map((ROLES_NAME, i) =>
                  <Col xs={6} sm={3} md={3} lg key={`${i}-roles-checkbox`} className={css.cellColumn}>
                    <label className={css.cell}>
                      <Checkbox
                        disabled={!this.props.isProjectAdmin}
                        onChange={(e) => this.changeRole(e, this.ROLES_NAME[i], this.ROLES_ID[i])}
                        checked={(roles && roles[ROLES_NAME]) || false}
                      />
                      <span className={css.labelText}>{this.ROLES_NAME[i]}</span>
                    </label>
                  </Col>
                )
                : null
            }
          </Row>
        </Col>
        {
          this.state.isConfirmDeleteOpen
            ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите удалить этого участника?"
              onCancel={this.handleCloseConfirmDelete}
              onConfirm={this.unbindUser}
              onRequestClose={this.handleCloseConfirmDelete}
            />
            : null
        }
      </Row>
    );
  }
}

Participant.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  showNotification: PropTypes.func,
  isProjectAdmin: PropTypes.bool,
  projectId: PropTypes.number,
  unbindUserToProject: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapDispatchToProps = {
  bindUserToProject,
  unbindUserToProject,
  showNotification
};

export default connect(null, mapDispatchToProps)(Participant);
