import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconEdit,
  IconPortfolio,
  IconUsers,
  IconExternalUsers,
  IconUser,
  IconList
} from '../../../components/Icons';
import isAdmin from '../../../utils/isAdmin';
import { DEV_OPS, EXTERNAL_USER, ADMIN } from '../../../constants/Roles';
import Toggle from '../../../components/LanguageToggle';
import { setLocalize } from '../../../actions/localize';
import localize from './navMenu.json';
import * as css from './NavMenu.scss';
import { getFirstName, getLastName, getFullName } from '../../../utils/NameLocalisation';
import classNames from 'classnames';

class NavMenu extends Component {
  static propTypes = {
    lang: PropTypes.string,
    mqlMatches: PropTypes.bool,
    setLocalize: PropTypes.func,
    sidebarDocked: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    toggleMenu: PropTypes.func,
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

  toggleLanguage = lang => this.props.setLocalize(lang);

  render() {
    const { lang, mqlMatches } = this.props;
    const iconStyles = {
      width: 16,
      height: 16
    };
    console.log(this.props.user.globalRole);
    const usersRolesLink = isAdmin(this.props.user.globalRole) ? (
      <li key="roles" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/roles">
          <button>
            <IconUsers style={iconStyles} />
          </button>
          <span>{localize[lang].USERS}</span>
        </Link>
      </li>
    ) : null;

    const usersRolesLinkButton = isAdmin(this.props.user.globalRole) ? (
      <li key="roles_btn">
        <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/roles">
          <IconUsers style={iconStyles} />
        </Link>
      </li>
    ) : null;

    const externalUsersLink = isAdmin(this.props.user.globalRole) ? (
      <li key="externalUsers" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/externalUsers">
          <button>
            <IconExternalUsers style={iconStyles} />
          </button>
          <span>{localize[lang].EXTERNAL_USERS}</span>
        </Link>
      </li>
    ) : null;

    const externalUsersLinkButton = isAdmin(this.props.user.globalRole) ? (
      <li key="externalUsers_btn">
        <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/externalUsers">
          <IconExternalUsers style={iconStyles} />
        </Link>
      </li>
    ) : null;

    const timesheetsLink =
      this.props.user.globalRole !== EXTERNAL_USER ? (
        <li key="timesheets" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/timesheets">
            <button>
              <IconCalendar style={iconStyles} />
            </button>
            <span>{localize[lang].TIMESHEETS}</span>
          </Link>
        </li>
      ) : null;

    const timesheetsLinkButton =
      this.props.user.globalRole !== EXTERNAL_USER ? (
        <li key="timesheets_btn">
          <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/timesheets">
            <IconCalendar style={iconStyles} />
          </Link>
        </li>
      ) : null;

    const timesheetsDevOpsLink =
      isAdmin(this.props.user.globalRole) || this.props.user.globalRole === DEV_OPS ? (
        <li key="devops" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/tasks-devops">
            <button>
              <IconList style={iconStyles} />
            </button>
            <span>{localize[lang].MY_TASKS_DEVOPS}</span>
          </Link>
        </li>
      ) : null;

    const timesheetsDevOpsLinkButton =
      isAdmin(this.props.user.globalRole) || this.props.user.globalRole === DEV_OPS ? (
        <li key="devops">
          <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/tasks-devops">
            <IconList style={iconStyles} />
          </Link>
        </li>
      ) : null;

    const projectsArchiveButton =
      this.props.user.globalRole === ADMIN ? (
        <li key="projectsArchive">
          <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/projects-archive">
            <IconPortfolio style={{ ...iconStyles, opacity: 0.3 }} />
          </Link>
        </li>
      ) : null;
    const projectsArchiveLink =
      this.props.user.globalRole === ADMIN ? (
        <li key="projectsArchive" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/projects-archive">
            <button>
              <IconPortfolio style={{ ...iconStyles, opacity: 0.3 }} />
            </button>
            <span>{localize[lang].PROJECTS_ARCHIVE}</span>
          </Link>
        </li>
      ) : null;

    const toggleButton = mqlMatches ? (
      <button
        key="toggle_btn"
        className={classNames(css.sidebarClosed, css.toggleButton)}
        onClick={this.props.toggleMenu}
      >
        {this.props.sidebarOpened ? <IconArrowLeft style={iconStyles} /> : <IconArrowRight style={iconStyles} />}
      </button>
    ) : null;

    const links = [
      <li key="projects" className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/projects">
          <button>
            <IconPortfolio style={iconStyles} />
          </button>
          <span>{localize[lang].MY_PROJECTS}</span>
        </Link>
      </li>,
      this.props.user.globalRole !== EXTERNAL_USER && (
        <li key="tasks" className={css.sidebarItem}>
          <Link className={css.sidebarLink} activeClassName={css.activeLink} to="/tasks">
            <button>
              <IconEdit style={iconStyles} />
            </button>
            <span>{localize[lang].MY_TASKS}</span>
          </Link>
        </li>
      ),
      timesheetsDevOpsLink,
      timesheetsLink,
      usersRolesLink,
      externalUsersLink,
      toggleButton,
      projectsArchiveLink
    ];

    const buttons = [
      <li key="projects">
        <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/projects">
          <IconPortfolio style={iconStyles} />
        </Link>
      </li>,
      <li key="tasks">
        <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to="/tasks">
          <IconEdit style={iconStyles} />
        </Link>
      </li>,
      timesheetsDevOpsLinkButton,
      timesheetsLinkButton,
      usersRolesLinkButton,
      externalUsersLinkButton,
      toggleButton,
      projectsArchiveButton
    ];

    const links_vs_buttons = this.props.sidebarOpened ? links : buttons;

    const sidebarHeader = (
      <div className={css.sidebarHeader}>
        <div className={css.ava}>{this.getPhoto()}</div>
        {this.props.sidebarOpened ? (
          <div className={css.userNameContainer}>
            <div className={css.userName}>{getFullName(this.props.user)}</div>
            <div className={css.userGroups}>{this.props.user.department}</div>
          </div>
        ) : null}
      </div>
    );

    return (
      <div className={this.props.sidebarOpened ? css.navigation : css.navigationMenuClosed}>
        {sidebarHeader}
        <ul className={css.sidebarLinks}>{links_vs_buttons}</ul>
        <Toggle lang={this.props.lang} onChange={this.toggleLanguage} location="navMenu" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  setLocalize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavMenu);
