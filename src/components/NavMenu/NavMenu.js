import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

import styles from './NavMenu.scss';

export default class NavMenu extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    photo: PropTypes.string
  };

  render() {
    const links = [
      (<li className={styles.sidebarItem}><Link className={styles.sidebarLink} activeClassName={styles.activeLink} to="/scrum">Scrum</Link></li>),
      (<li className={styles.sidebarItem}><Link className={styles.sidebarLink} activeClassName={styles.activeLink} to="/project">Мои проекты</Link></li>),
      (<li className={styles.sidebarItem}><Link className={styles.sidebarLink} activeClassName={styles.activeLink} to="/tasks">Мои задачи</Link></li>),
      (<li className={styles.sidebarItem}><Link className={styles.sidebarLink} activeClassName={styles.activeLink} to="/repeat">Отчеты по времени</Link></li>)
    ];

    const sidebarHeader = (
      <div className={styles.sidebarHeader}>
        <div className={styles.userAvatar}>
          <img src={this.props.user.photo} alt=""/>
        </div>
        <div className={styles.userNameContainer}>
          {this.props.user.firstNameRu} {this.props.user.lastNameRu}
        </div>
        <div className={styles.logoutButton}></div>
      </div>
    );

    return (
      <div className={styles.navigation}>
        {sidebarHeader}
        {links}
      </div>
    );
  }
}
