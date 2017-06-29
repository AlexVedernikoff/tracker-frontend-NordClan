import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { IconPlus } from '../../../components/Icons';
import { connect } from 'react-redux';

class NavMenu extends Component {
  render() {
    const css = require('./NavMenu.scss');

    // Mocks

    const groups = [{ name: 'Название группы' }];
    const photo = 'http://lorempixel.com/200/200/people/';
    const firstNameRu = 'Андрей';
    const lastNameRu = 'Юдин';

    const iconStyles = {
      width: 16,
      height: 16
    };

    const links = [
      <li key="dashboard" className={css.sidebarItem}>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/dashboard"
        >
          Монитор
        </Link>
      </li>,
      <li key="projects" className={css.sidebarItem}>
        <button><IconPlus style={iconStyles} /></button>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/projects"
        >
          Мои проекты
        </Link>
      </li>,
      <li key="tasks" className={css.sidebarItem}>
        <button><IconPlus style={iconStyles} /></button>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/tasks"
        >
          Мои задачи
        </Link>
      </li>,
      <li key="repeat" className={css.sidebarItem}>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/repeat"
        >
          Отчеты по времени
        </Link>
      </li>
    ];

    const userGroups = groups.map(function createList(item, index) {
      return <span key={index}>{item.name}</span>;
    });

    const sidebarHeader = (
      <div className={css.sidebarHeader}>
        <div className={css.userAvatar}>
          <img src={photo} alt="" />
        </div>
        <div className={css.userNameContainer}>
          <div className={css.userName}>{this.props.firstNameRu} {this.proskype.lastNameRu}</div>
          <div className={css.userGroups}>{userGroups}</div>
        </div>
      </div>
    );

    return (
      <div className={css.navigation}>
        {sidebarHeader}
        <ul className={css.sidebarLinks}>
          {links}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user
  };
};

NavMenu.propTypes = {
  user: PropTypes.object
};

export default connect(mapStateToProps)(NavMenu);
