import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getUsers from '../../actions/UsersRoles';

class UsersRoles extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <h1>UserRoles is here</h1>
      </div>
    );
  }
}

export default UsersRoles;
