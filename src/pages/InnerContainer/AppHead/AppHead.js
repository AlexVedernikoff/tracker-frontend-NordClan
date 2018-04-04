import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconExitApp, IconMenu, IconSearch } from '../../../components/Icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Logo from '../../../components/Logo';
import { EXTERNAL_USER } from '../../../constants/Roles';
import Loader from './Loader';
import { history } from '../../../History';
import Playlist from './Playlist';
import { connect } from 'react-redux';

import * as css from './AppHead.scss'; // Стили для плавного появления и скрытия лоадера

class AppHead extends Component {
  static propTypes = {
    globalRole: PropTypes.string,
    loading: PropTypes.number,
    toggleMenu: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    history.push('/logout');
  };

  render() {
    const iconStyles = {
      width: 16,
      height: 16
    };
    const { globalRole } = this.props;
    return (
      <div className={css.toppanel}>
        <div className={css.menuToggle} onClick={this.props.toggleMenu}>
          <IconMenu style={iconStyles} />
        </div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
        {globalRole !== EXTERNAL_USER ? <Playlist /> : null}
        {/* <div className={css.search}>
          <input
            type="text"
            id="mainSearch"
            className={css.searchInput}
            placeholder="Поиск по названию"
          />
          <label htmlFor="mainSearch" className={css.searchButton}>
            <IconSearch style={iconStyles} />
          </label>
        </div> */}
        <div className={css.logoutButton} onClick={this.handleLogout}>
          <IconExitApp style={iconStyles} />
        </div>
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.loading ? <Loader /> : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.Loading.loading,
    globalRole: state.Auth.user.globalRole
  };
};

export default connect(mapStateToProps)(AppHead);
