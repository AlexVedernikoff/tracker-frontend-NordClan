import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import localize from './usersRoles.json';
import * as css from './UsersRoles.scss';

import SelectDropdown from '../../components/SelectDropdown';
import Button from '../../components/Button';

import { getUsers, updateUserRole } from '../../actions/UsersRoles';

import { getFullName } from '../../utils/NameLocalisation';
import isHR from '../../utils/isHR';
import isAdmin from '../../utils/isAdmin';
import Title from '../../components/Title';
import { toIso } from '~/helpers/toIso';
import { UsersRolesFilters } from '~/components/UsersRolesFilters';
import { mapFilterToUrl } from '~/components/FiltrersManager/helpers';
import checkRoles from '../../utils/checkRoles';
import { isVisor } from '../../utils/isVisor';

class UsersRoles extends React.Component<any, any> {
  static propTypes = {
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

  constructor(props) {
    super(props);

    this.state = {
      users: '',
    };
  }

  isVisorRole = checkRoles.isVisor(this.props.userGlobalRole);

  fetchUsers = (filters: Record<string, unknown>) => {
    const query = Object
      .entries(filters)
      .map(([key, value]) => mapFilterToUrl(value, key, true))
      .join('&')
    this.props.getUsers(query);
  }

  handlerGetDeletedUsers = () => {
    if (this.props.location.pathname === '/roles') {
      return this.props.router.push('/roles/archive');
    }
    return this.props.router.push('/roles')
  };

  handleChangeStatus = userId => event => {
    const updatedUserData = {
      id: userId,
      globalRole: event.value
    };
    this.props.updateUserRole(updatedUserData);
  };

  renderStatusSelector(globalRole, userId) {
    const { lang, userGlobalRole } = this.props;

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
        disabled={!isAdmin(userGlobalRole) || this.isVisorRole}
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

  onFilterChange = (field: string) => {
    return (value: string | number | (string | number)[]) => {
      this.setState({
        ...this.state,
        filters: {
          ...this.state.filters,
          [field]: value
        }
      })
    }
  }

  renderRowUser(user) {
    const { router } = this.props;
    const {
      id,
      globalRole,
      birthDate,
      city,
      department,
      employmentDate,
      mobile,
      telegram,
    } = user;
    



    const fullName = getFullName(user) || 'NoName';

    const status = this.renderStatusSelector(globalRole, id);

    return (
      <tr key={id} className={css.userRow}>
        <td>
          {!this.isVisorRole ? (
            <a className={css.userRowFullName} onClick={() => router.push(`/users-profile/${id}`)}>
              {fullName}
            </a>
          ) : (
            <span className={css.fullName}>
              {fullName}
            </span>
          )}
        </td>
        <td>
          {toIso(employmentDate)}
        </td>
        <td>
          {city}
        </td>
        <td>
          {toIso(birthDate)}
        </td>
        <td>
          {telegram}
        </td>
        <td>
          {mobile}
        </td>
        <td>
          {department?.map((dep, index) => (
            <div key={dep.name + index}>{dep.name}</div>
          ))}
        </td>
        <td className={css.userRowStatus}>{status}</td>
      </tr>
    );
  }

  renderTableUsers(users) {

    const tableHeadColumns = ["USER", "BIRTHDAY", "CITY", "EMPLOYMENT_DATE", "TELEGRAM", "PHONE", "DEPARTMENTS", "ROLE"]

    const tableHead = tableHeadColumns.map(column => <th key={column}>{localize[this.props.lang][column]}</th>)

    const tableBody = users.map(user => {
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

    if ([isAdmin, isHR, isVisor].some(checkRole => checkRole(userGlobalRole))) {
      return (
        <div>
          <Title render={`[Epic] - ${localize[lang].USERS}`} />
          <div className={css.titleWrap}>
            <h1>{localize[lang].USERS}</h1>
            {!checkRoles.isVisor(userGlobalRole) && <Button text={localize[lang].BTN_ADD_USERS} onClick={() => router.push('/users-profile/')} />}
          </div>
          <UsersRolesFilters
            lang={this.props.lang}
            fetchUsers={this.fetchUsers}
            location={this.props.location}
          />
          <hr />
          <div className={css.titleWrap}>
            <h1 />
            {allUserProp && <a onClick={() => this.handlerGetDeletedUsers()}>{localize[lang].ARCHIVE}</a>}
            {!allUserProp && <a onClick={() => this.handlerGetDeletedUsers()}>{localize[lang].ALL_USERS}</a>}
          </div>
          {tableUsers}
        </div>
      );
    }

    return null;
  }
}

(UsersRoles as any).propTypes = {
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
