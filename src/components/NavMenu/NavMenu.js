import React, {Component, PropTypes} from 'react';
import {IconExitApp} from '../../components/Icons/Icons';
import {IconPlus} from '../../components/Icons/Icons';
import { Link } from 'react-router';

export default class NavMenu extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    photo: PropTypes.string
  };

  render() {
    const css = require('./NavMenu.scss');

    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    const links = [
      (<li className={css.sidebarItem}><Link className={css.sidebarLink} activeClassName={css.activeLink} to="/scrum">Scrum</Link></li>),
      (<li className={css.sidebarItem}><Link className={css.sidebarLink} activeClassName={css.activeLink} to="/project">Мои проекты</Link></li>),
      (<li className={css.sidebarItem}><button><IconPlus style={iconStyles} /></button><Link className={css.sidebarLink} activeClassName={css.activeLink} to="/tasks">Мои задачи</Link></li>),
      (<li className={css.sidebarItem}><Link className={css.sidebarLink} activeClassName={css.activeLink} to="/repeat">Отчеты по времени</Link></li>)
    ];

    const userGroups = this.props.user.groups.map(function createList(item, index) {
      return (<span key={index}>{item.name}, </span>);
    });

    const sidebarHeader = (
      <div className={css.sidebarHeader}>
        <div className={css.userAvatar}>
          <img src={this.props.user.photo} alt=""/>
        </div>
        <div className={css.userNameContainer}>
          <div className={css.userName}>{this.props.user.firstNameRu} {this.props.user.lastNameRu}</div>
          <div className={css.userGroups}>{userGroups}</div>
        </div>
        <a href="/" className={css.logoutButton}>
          <IconExitApp style={iconStyles} />
        </a>
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
