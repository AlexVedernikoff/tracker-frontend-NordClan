import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconPlus } from '../../../components/Icons';
import { connect } from 'react-redux';
import isAdmin from '../../../utils/isAdmin';
import { EXTERNAL_USER } from '../../../constants/Roles';
import * as css from './NavMenu.scss';

class NavMenu extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  getPhoto = () => {
    const { user: { photo, firstNameRu, lastNameRu } } = this.props;
    if (photo) {
      return <img src={photo} alt="" />;
    }
    if (firstNameRu && lastNameRu) {
      return `
          ${firstNameRu.slice(0, 1) || ''}
          ${lastNameRu.slice(0, 1) || ''}
          `;
    }
  };

  render() {
    const iconStyles = {
      width: 16,
      height: 16
    };

    const usersRolesLink = isAdmin(this.props.user.globalRole) ? (
      <li key="roles" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/roles">
          Пользователи
        </Link>
      </li>
    ) : null;
    const externalUsersLink = isAdmin(this.props.user.globalRole) ? (
      <li key="externalUsers" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/externalUsers">
          Внешние пользователи
        </Link>
      </li>
    ) : null;
    const timesheetsLink =
      this.props.user.globalRole !== EXTERNAL_USER ? (
        <li key="timesheets" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/timesheets">
            Отчеты по времени
          </Link>
        </li>
      ) : null;
    const links = [
      /*<li key="dashboard" className={css.sidebarItem}>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/dashboard"
        >
          Монитор
        </Link>
      </li>, */
      <li key="projects" className={css.sidebarItem}>
        <button>
          <IconPlus style={iconStyles} />
        </button>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/projects">
          Мои проекты
        </Link>
      </li>,
      <li key="tasks" className={css.sidebarItem}>
        <button>
          <IconPlus style={iconStyles} />
        </button>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/tasks">
          Мои задачи
        </Link>
      </li>,
      timesheetsLink,
      usersRolesLink,
      externalUsersLink
    ];

    const sidebarHeader = (
      <div className={css.sidebarHeader}>
        <div className={css.ava}>{this.getPhoto()}</div>
        <div className={css.userNameContainer}>
          <div className={css.userName}>
            {this.props.user.firstNameRu} {this.props.user.lastNameRu}
          </div>
          <div className={css.userGroups}>{this.props.user.department}</div>
        </div>
      </div>
    );

    return (
      <div className={css.navigation}>
        {sidebarHeader}
        <ul className={css.sidebarLinks}>{links}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user
});

export default connect(mapStateToProps)(NavMenu);
