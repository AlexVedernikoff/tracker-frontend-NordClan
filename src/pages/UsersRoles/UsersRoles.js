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
    return (
      <div>
        <h1>UsersRoles is here</h1>
        <p>users - {this.props.users[0]}</p>
      </div>
    );
  }
}

UsersRoles.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  users: state.UsersRoles.users
});

const mapDispatchToProps = {
  getUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersRoles);
