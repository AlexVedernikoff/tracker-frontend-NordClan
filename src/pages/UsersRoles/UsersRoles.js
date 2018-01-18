import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getUsers from '../../actions/UsersRoles';

class UsersRoles extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      users: ''
    };
  }

  componentDidMount () {
    this.props.getUsers();
  }

  render () {
    console.log(3, this.state);
    return (
      <div>
        <h1>UserRoles is here</h1>
      </div>
    );
  }
}

UsersRoles.propTypes = {
  getUsers: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  getUsers
};

export default connect(null, mapDispatchToProps)(UsersRoles);
