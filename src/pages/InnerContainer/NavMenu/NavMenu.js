import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { IconPlus } from '../../../components/Icons';
import { connect } from 'react-redux';
import { getInfoAboutMe } from '../../../actions/Authentication';

class NavMenu extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { getInfoAboutMe } = this.props;
    getInfoAboutMe();
  }

  render () {
    const css = require('./NavMenu.scss');

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
        <button>
          <IconPlus style={iconStyles} />
        </button>
        <Link
          className={css.sidebarLink}
          activeClassName={css.activeLink}
          to="/projects"
        >
          Мои проекты
        </Link>
      </li>,
      <li key="tasks" className={css.sidebarItem}>
        <button>
          <IconPlus style={iconStyles} />
        </button>
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

    const sidebarHeader = (
      <div className={css.sidebarHeader}>
        <div className={css.ava}>
          {this.props.user.photo
            ? <img src={this.props.user.photo} alt="" />
            : `${(this.props.user.firstNameRu.slice(0, 1) || '')
                + this.props.user.lastNameRu.slice(0, 1)}`}
        </div>
        <div className={css.userNameContainer}>
          <div className={css.userName}>
            {this.props.user.firstNameRu} {this.props.user.lastNameRu}
          </div>
          <div className={css.userGroups}>
            {this.props.user.department}
          </div>
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

NavMenu.propTypes = {
  user: PropTypes.object,
  getInfoAboutMe: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.Auth.user
});

const mapDispatchToProps = {
  getInfoAboutMe
};

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);
