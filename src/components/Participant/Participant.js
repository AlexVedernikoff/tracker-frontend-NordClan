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
    let stringRoles = '0';
    const sendRoles = this.state.sendRoles;
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
    } else {
      sendRoles.push(roleId);
    }
    this.setState({ sendRoles: sendRoles });
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
      if (prop.user.roles[key]) {
        sendRoles.push(this.ROLES_ID[this.ROLES_NAME.indexOf(key)]);
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
          <IconClose
              className={css.iconClose}
              onClick={this.unbindUser}
            />
          <div className={classnames(css.cell, css.memberColumn)}>
            {user.fullNameRu}
          </div>
        </Col>
        <Col xs={9}>
          <Row>
            {this.ROLES_NAME
              ? this.ROLES_NAME.map((ROLES_NAME, i) =>
              <Col xs key={`${i}-roles-checkbox`}>
                <label className={css.cell}>
                  <Checkbox onChange={(e) => this.changeRole(e, this.ROLES_NAME[i], this.ROLES_ID[i])}
                            checked={(roles && roles[ROLES_NAME]) || false}/>
                </label>
              </Col>
            ) : null}
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
