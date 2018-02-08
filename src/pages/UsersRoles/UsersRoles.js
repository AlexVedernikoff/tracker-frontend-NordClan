import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SelectDropdown from '../../components/SelectDropdown';
import isAdmin from '../../utils/isAdmin';

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
    const newUserStatus = event.value;
    const userIndex = _.findIndex(users, { id: userId });
    const updatedUser = users[userIndex];
    updatedUser.globalRole = newUserStatus;
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    const updatedUserData = {
      id: updatedUser.id,
      globalRole: updatedUser.globalRole
    };
    this.setState({
      users
    }, this.props.updateUserRole(updatedUserData));
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

    const options = statuses.map(status => ({
      value: status.value,
      key: status.id,
      label: status.name
    }));

    return (
      <SelectDropdown
        multi={false}
        clearable={false}
        value={globalRole}
        onChange={this.handleChangeStatus(userId)}
        options={options}
        />
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
    const { users, userGlobalRole } = this.props;
    const tableUsers = this.renderTableUsers(users);
    return isAdmin(userGlobalRole)
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
  updateUserRole: PropTypes.func,
  userGlobalRole: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  users: state.UsersRoles.users,
  userGlobalRole: state.Auth.user.globalRole
});

const mapDispatchToProps = {
  getUsers,
  updateUserRole
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersRoles);
