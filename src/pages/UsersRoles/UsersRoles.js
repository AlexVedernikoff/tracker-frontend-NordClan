import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as css from './UsersRoles.scss';

import { getUsers, updateUserRole } from '../../actions/UsersRoles';

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

  handleChangeStatus = (userId) => (event) => {
    const { users } = this.props;
    const newUserStatus = event.target.value;
    const userIndex = _.findIndex(users, { id: userId });
    const updatedUser = users[userIndex];
    updatedUser.globalRole = newUserStatus;
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    this.setState({
      users
    }, this.props.updateUserRole(updatedUser));
  }

  renderStatusSelector (globalRole, userId) {
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

    const options = statuses.map(status =>
      (<option key={status.id} value={status.value}>{status.name}</option>));

    return (
      <select value={globalRole} onChange={this.handleChangeStatus(userId)}>
        {options}
      </select>
    );
  }

  renderRowUser (user) {
    const { id, lastNameRu, firstNameRu, globalRole} = user;
    const fullName = `${lastNameRu} ${firstNameRu}`;
    const status = this.renderStatusSelector(globalRole, id);
    return (
      <tr key={id} className={css.userRow}>
        <td>
          {fullName}
        </td>
        <td>
          {status}
        </td>
      </tr>
    );
  }

  renderTableUsers (users) {
    const tableHead = (
      <tr className={css.usersRolesHeader}>
        <th>
          Пользователь
        </th>
        <th>
          Роль
        </th>
      </tr>
    );
    const tableBody = users.map(user => {
      return this.renderRowUser(user);
    });
    return (
      <table className={css.usersRolesTable}>
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
    const { users, isAdmin } = this.props;
    const tableUsers = this.renderTableUsers(users);
    return isAdmin
    ? <div>
        <h1>Пользователи</h1>
        <hr/>
        {tableUsers}
      </div>
    : null;
  }
}

UsersRoles.propTypes = {
  getUsers: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  updateUserRole: PropTypes.func,
  users: PropTypes.array
};

const mapStateToProps = state => ({
  users: state.UsersRoles.users,
  isAdmin: state.Auth.user.globalRole === 'ADMIN'
});

const mapDispatchToProps = {
  getUsers,
  updateUserRole
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersRoles);
