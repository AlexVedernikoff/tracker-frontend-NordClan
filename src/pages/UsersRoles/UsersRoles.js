import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectDropdown from '../../components/SelectDropdown';
import isAdmin from '../../utils/isAdmin';
import Button from '../../components/Button';

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
    if (this.props.location.pathname === '/roles') {
      this.props.getUsers(true);
    } else if (this.props.location.pathname === '/roles/archive') {
      this.props.getUsers(false);
    }
  }

  handlerGetDeletedUsers = () => {
    if (this.props.location.pathname === '/roles') {
      this.props.getUsers(false);
      this.props.router.push('/roles/archive');
    } else if (this.props.location.pathname === '/roles/archive') {
      this.props.getUsers(true);
      this.props.router.push('/roles');
    }
  };

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
      },
      {
        name: localize[lang].HR,
        value: 'HR',
        id: 5
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
    let fullName = getFullName(user);

    if (fullName === undefined) {
      fullName = 'NoName';
    }

    const status = this.renderStatusSelector(globalRole, id);
    return (
      <tr key={id} className={css.userRow}>
        <td>
          <a className={css.userRowFullName} onClick={() => router.push(`/users-profile/${id}`)}>
            {fullName}
          </a>
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
    let allUserProp = true;
    if (this.props.location.pathname === '/roles') {
      allUserProp = true;
    } else if (this.props.location.pathname === '/roles/archive') {
      allUserProp = false;
    }
    const { users, userGlobalRole, lang, router } = this.props;
    const tableUsers = this.renderTableUsers(users);
    return isAdmin(userGlobalRole) ? (
      <div>
        <Title render={`[Epic] - ${localize[lang].USERS}`} />
        <div className={css.titleWrap}>
          <h1>{localize[lang].USERS}</h1>
          <Button text={localize[lang].BTN_ADD_USERS} onClick={() => router.push('/users-profile/')} />
        </div>
        <hr />

        <div className={css.titleWrap}>
          <h1 />
          {allUserProp && <a onClick={() => this.handlerGetDeletedUsers()}>{localize[lang].ARCHIVE}</a>}
          {!allUserProp && <a onClick={() => this.handlerGetDeletedUsers()}>{localize[lang].ALL_USERS}</a>}
        </div>
        {tableUsers}
      </div>
    ) : null;
  }
}

UsersRoles.propTypes = {
  getUsers: PropTypes.func.isRequired,
  lang: PropTypes.string,
  location: PropTypes.shape({
    action: PropTypes.string.isRequired,
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
    search: PropTypes.string,
    state: PropTypes.object
  }).isRequired,
  params: PropTypes.shape({
    id: PropTypes.string
  }),
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
