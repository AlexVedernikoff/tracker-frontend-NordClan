import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {IconSearch} from '../../../components/Icons';
import {IconExitApp} from '../../../components/Icons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Logo from '../../../components/Logo';
import Loader from './Loader';
import { doLogout } from '../../../actions/Authentication';
import { connect } from 'react-redux';

import * as css from './AppHead.scss'; // Стили для плавного появления и скрытия лоадера

class AppHead extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isLogoutSending: this.props.isLogoutSending,
      loading: false
    };
  }

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(doLogout());
  }

  testLoad = () => {
    this.setState({loading: true});
    setTimeout(() => this.setState({loading: false}), 3000);
  }

  render () {
    const iconStyles = {
      width: 16,
      height: 16
    };

    return (
      <div className={css.toppanel}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
        <div className={css.search}>
          <input
            type="text"
            id="mainSearch"
            className={css.searchInput}
            placeholder="Поиск по названию"
          />
          <label htmlFor="mainSearch" className={css.searchButton}>
            <IconSearch style={iconStyles} />
          </label>
        </div>
        <div className={css.logoutButton} onClick={this.handleLogout}>
          <IconExitApp style={iconStyles} />
        </div>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.props.loading
            ? <Loader/>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLogoutSending: state.Auth.isLogoutSending,
    loading: state.Loading.loading
  };
};

export default connect(mapStateToProps)(AppHead);
