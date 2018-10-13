import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';
import PortfolioEditor from './PortfolioEditor';
import GitLabEditor from './GitLabEditor';
import TypeEditor from './TypeEditor';
import JiraEditor from './JiraEditor';
import connect from 'react-redux/es/connect/connect';
import { EXTERNAL_USER } from '../../../constants/Roles';
import PropTypes from 'prop-types';

class Settings extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  checkIsExternalUser = () => this.props.user.globalRole === EXTERNAL_USER;

  render() {
    return (
      <div>
        <ParticipantEditor />
        <TypeEditor />
        <StatusEditor />
        <PortfolioEditor />
        <JiraEditor />
        {!this.checkIsExternalUser() ? <GitLabEditor /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.Auth.user
  };
}

export default connect(mapStateToProps)(Settings);
