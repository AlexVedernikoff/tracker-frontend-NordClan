import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Participant.scss';
import {IconClose} from '../Icons';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Checkbox from '../../components/Checkbox';
import {connect} from 'react-redux';
import { bindUserToProject, unbindUserToProject } from '../../actions/Project';

class Participant extends React.Component {
  constructor (props) {
    super(props);
    this.ROLES_NAME = ['dev', 'back', 'front', 'review', 'qa', 'unbillable'];
    this.ROLES_ID = ['1', '2', '3', '4', '5', '10'];
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
    const self = this;
    let stringRoles = '0';
    const sendRoles = self.state.sendRoles;
    switch (role) {
    case this.ROLES_NAME[0]:
      let triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    case this.ROLES_NAME[1]:
      triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    case this.ROLES_NAME[2]:
      triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    case this.ROLES_NAME[3]:
      triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    case this.ROLES_NAME[4]:
      triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    case this.ROLES_NAME[5]:
      triger = false;
      if (sendRoles.length) {
        sendRoles.forEach(function (r, i) {
          if (r === roleId) {
            sendRoles.splice(i, 1);
            triger = true;
          }
        });
        if (!triger) {
          sendRoles.push(roleId);
        }
        break;
      } else {
        sendRoles.push(roleId);
        break;
      }
    default: break;
    }
    self.setState({ sendRoles: sendRoles });
    if (sendRoles.length) {
      stringRoles = sendRoles.join(',');
    }
    this.props.bindUserToProject(
      this.props.projectId,
      this.props.user.id,
      stringRoles
    );
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
      switch (key) {
      case this.ROLES_NAME[0]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[0]);
        }
        break;
      case this.ROLES_NAME[1]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[1]);
        }
        break;
      case this.ROLES_NAME[2]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[2]);
        }
        break;
      case this.ROLES_NAME[3]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[3]);
        }
        break;
      case this.ROLES_NAME[4]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[4]);
        }
        break;
      case this.ROLES_NAME[5]:
        if (prop.user.roles[key]) {
          sendRoles.push(this.ROLES_ID[5]);
        }
        break;
      default: break;
      }
    }

    return sendRoles;
  };
  render () {
    const {
      user,
      ...other
    } = this.props;

    const roles = user.roles;

    return (
      <Row className={css.memberRow}>
        <Col xs={3}>
          <div className={classnames(css.cell, css.memberColumn)}>
            {user.fullNameRu}
          </div>
        </Col>
        <Col xs={9}>
          <Row>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[0], this.ROLES_ID[0])}
                          checked={(roles && roles.dev) || false}/>
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[1], this.ROLES_ID[1])}
                          checked={(roles && roles.back) || false}/>
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[2], this.ROLES_ID[2])}
                          checked={(roles && roles.front) || false}/>
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[3], this.ROLES_ID[3])}
                          checked={(roles && roles.review) || false}/>
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[4], this.ROLES_ID[4])}
                          checked={(roles && roles.qa) || false}/>
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[5], this.ROLES_ID[5])}
                          checked={(roles && roles.unbillable) || false}/>
              </label>
            </Col>
            <IconClose
              className={css.iconClose}
              onClick={this.unbindUser}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

Participant.propTypes = {
  bindUserToProject: PropTypes.func.isRequired,
  projectId: PropTypes.number,
  unbindUserToProject: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapDispatchToProps = {
  bindUserToProject,
  unbindUserToProject
};

export default connect(null, mapDispatchToProps)(Participant);
