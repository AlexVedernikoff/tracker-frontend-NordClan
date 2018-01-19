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

  handleChangeStatus () {
    console.log(1);
  }

  createStatusSelector (globalRole) {
    const statuses = [
      {
        name: 'Администратор',
        value: 'ADMIN',
        id: 1
      },
      {
        name: 'Пользователь',
        value: 'USER',
        id: 2
      },
      {
        name: 'Наблюдатель',
        value: 'VISOR',
        id: 3
      }
    ];

    const options = statuses.map(status => {
      const option = <option key={status.id} value={status.value}>{status.name}</option>;
      return option;
    });
    return (
      <select value={globalRole} onChange={this.handleChangeStatus}>
        {options}
      </select>
    );
  }

  createRowUser (user) {
    const { id, lastNameRu, firstNameRu, globalRole} = user;
    const fullName = `${lastNameRu} ${firstNameRu}`;
    const status = this.createStatusSelector(globalRole);
    return (
      <tr key={id}>
        <td>
          {fullName}
        </td>
        <td>
          {status}
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
