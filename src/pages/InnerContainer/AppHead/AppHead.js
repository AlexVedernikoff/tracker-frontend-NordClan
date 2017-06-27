import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconExitApp } from '../../../components/Icons';
import { IconSearch } from '../../../components/Icons';
import Logo from '../../../components/Logo';
import { doLogout } from "../../../actions/Authentication";
import { connect } from "react-redux";

import * as css from './AppHead.scss';

class AppHead extends Component {
  constructor(props) {
    super(props);
  }

  handleLogout = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(doLogout());
  }

  render() {
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit'
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
      </div>
    );
  }
}

export default connect(null)(AppHead);
