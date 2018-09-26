import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconPlus, IconUser } from '../../../components/Icons';
import { connect } from 'react-redux';
import isAdmin from '../../../utils/isAdmin';
import { EXTERNAL_USER } from '../../../constants/Roles';
import localize from './navMenu.json';
import * as css from './NavMenu.scss';
import { getFirstName, getLastName, getFullName } from '../../../utils/NameLocalisation';

class NavMenu extends Component {
  static propTypes = {
    lang: PropTypes.string,
    user: PropTypes.object
  };

  getPhoto = () => {
    const {
      user: { photo }
    } = this.props;
    if (photo) {
      return <img src={photo} alt="" />;
    }
    const firstName = getFirstName(this.props.user);
    const lastName = getLastName(this.props.user);
    if (firstName && lastName) {
      return `
          ${firstName.slice(0, 1) || ''}
          ${lastName.slice(0, 1) || ''}
          `;
    }
    return (
      <IconUser
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    );
  };

  render() {
    const { lang } = this.props;
    const iconStyles = {
      width: 16,
      height: 16
    };
    const usersRolesLink = isAdmin(this.props.user.globalRole) ? (
      <li key="roles" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/roles">
          {localize[lang].USERS}
        </Link>
      </li>
    ) : null;
    const externalUsersLink = isAdmin(this.props.user.globalRole) ? (
      <li key="externalUsers" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/externalUsers">
          {localize[lang].EXTERNAL_USERS}
        </Link>
      </li>
    ) : null;
    const timesheetsLink =
      this.props.user.globalRole !== EXTERNAL_USER ? (
        <li key="timesheets" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/timesheets">
            {localize[lang].TIMESHEETS}
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
          {localize[lang].MY_PROJECTS}
        </Link>
      </li>,
      <li key="tasks" className={css.sidebarItem}>
        <button>
          <IconPlus style={iconStyles} />
        </button>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/tasks">
          {localize[lang].MY_TASKS}
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
          <div className={css.userName}>{getFullName(this.props.user)}</div>
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
  user: state.Auth.user,
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(NavMenu);
