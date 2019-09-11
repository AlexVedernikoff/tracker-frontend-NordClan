import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectDropdown from '../../components/SelectDropdown';
import isAdmin from '../../utils/isAdmin';

import * as css from './UsersRoles.scss';
import { getUsers, updateUserRole } from '../../actions/UsersRoles';
import localize from './usersRoles.json';
import { getLastName, getFullName } from '../../utils/NameLocalisation';
import Title from 'react-title-component';

class UsersRoles extends React.Component {
  state = {
    users: ''
  };

  componentDidMount() {
    this.props.getUsers();
  }

  handleChangeStatus = userId => event => {
    const updatedUserData = {
      id: userId,
      globalRole: event.value
    };
    this.props.updateUserRole(updatedUserData);
  };

  renderStatusSelector(globalRole, userId) {
    const { lang } = this.props;
    const statuses = [
      {
        name: localize[lang].ADMIN,
        value: 'ADMIN',
        id: 1
      },
      {
        name: localize[lang].USER,
        value: 'USER',
        id: 2
      },
      {
        name: localize[lang].VISOR,
        value: 'VISOR',
        id: 3
      },
      {
        name: localize[lang].DEV_OPS,
        value: 'DEV_OPS',
        id: 4
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
        backspaceRemoves={false}
        searchable={false}
        value={globalRole}
        onChange={this.handleChangeStatus(userId)}
        options={options}
      />
    );
  }

  renderRowUser(user) {
    const { router } = this.props;
    const { id, globalRole } = user;
    const fullName = getFullName(user);
    const status = this.renderStatusSelector(globalRole, id);
    return (
      <tr key={id} className={css.userRow}>
        <td>
          <button className={css.userRowFullName} onClick={() => router.push(`/users-profile/${id}`)}>
            {fullName}
          </button>
        </td>
        <td className={css.userRowStatus}>{status}</td>
      </tr>
    );
  }

  renderTableUsers(users) {
    const sortedUsers = users.sort((user1, user2) => {
      if (getLastName(user1) > getLastName(user2)) {
        return 1;
      } else if (getLastName(user1) < getLastName(user2)) {
        return -1;
      } else {
        return 0;
      }
    });
    const tableHead = (
      <tr className={css.usersRolesHeader}>
        <th>{localize[this.props.lang].USER}</th>
        <th>{localize[this.props.lang].ROLE}</th>
      </tr>
    );
    const tableBody = sortedUsers.map(user => {
      return this.renderRowUser(user);
    });
    return (
      <table className={css.usersRolesTable}>
        <thead>{tableHead}</thead>
        <tbody>{tableBody}</tbody>
      </table>
    );
  }

  render() {
    const { users, userGlobalRole, lang } = this.props;
    const tableUsers = this.renderTableUsers(users);
    return isAdmin(userGlobalRole) ? (
      <div>
        <Title render={`[object Object] - ${localize[lang].USERS}`} />
        <h1>{localize[lang].USERS}</h1>
        <hr />
        {tableUsers}
      </div>
    ) : null;
  }
}

UsersRoles.propTypes = {
  getUsers: PropTypes.func.isRequired,
  lang: PropTypes.string,
  router: PropTypes.object.isRequired,
  updateUserRole: PropTypes.func,
  userGlobalRole: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  users: state.UsersRoles.users,
  userGlobalRole: state.Auth.user.globalRole,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getUsers,
  updateUserRole
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersRoles);
