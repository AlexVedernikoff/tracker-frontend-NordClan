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

  createRowUser (user) {
    const fullName = `${user.lastNameRu} ${user.firstNameRu}`;
    return (
      <tr key={user.id}>
        <td>
          {fullName}
        </td>
        <td>
          {user.globalRole}
        </td>
      </tr>
    );
  }

  createTableUsers (users) {
    const tableHead = (
      <tr>
        <th>
          Имя пользователя
        </th>
        <th>
          Статус
        </th>
      </tr>
    );
    const tableBody = users.map(user => {
      return this.createRowUser(user);
    });
    return (
      <table>
        <thead>
          {tableHead}
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    );
  }

  render () {
    const users = this.props.users;
    const tableUsers = this.createTableUsers(users);
    return (
      <div>
        <h1>Пользователи</h1>
        {tableUsers}
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
