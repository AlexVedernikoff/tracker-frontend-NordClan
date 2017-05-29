import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {IconExitApp} from '../../../components/Icons';
import {IconSearch} from '../../../components/Icons';

import * as css from './AppHead.scss';

export default class AppHead extends Component {

  static contextTypes = {
    user: PropTypes.object
  };

  render () {
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit'
    };

    // console.log(Link);

    return (
      <div className={css.toppanel}>
        <Link to="/" className={css.logo}>
          <span>Sim</span>Track
        </Link>
        <div className={css.search}>
          <input type="text" id="mainSearch" className={css.searchInput} placeholder="Поиск по названию" />
          <label htmlFor="mainSearch" className={css.searchButton}>
            <IconSearch style={iconStyles} />
          </label>
        </div>
        <Link to="/" className={css.logoutButton}>
          <IconExitApp style={iconStyles} />
        </Link>
      </div>
    );
  }
}

