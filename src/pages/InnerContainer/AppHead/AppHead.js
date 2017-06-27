import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {IconExitApp} from '../../../components/Icons';
import {IconSearch} from '../../../components/Icons';
import Logo from '../../../components/Logo';
import Loader from './Loader';

import * as css from './AppHead.scss'; // Стили для плавного появления и скрытия лоадера

export default class AppHead extends Component {

  static contextTypes = {
    user: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {loading: false};
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
        <Link to="/" style={{textDecoration: 'none'}}>
          <Logo/>
        </Link>
        <div className={css.search}>
          <input type="text" id="mainSearch" className={css.searchInput} placeholder="Поиск по названию" />
          <label htmlFor="mainSearch" className={css.searchButton}>
            <IconSearch style={iconStyles} />
          </label>
        </div>
        <Link className={css.logoutButton} onClick={this.testLoad}>
          <IconExitApp style={iconStyles} />
        </Link>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.loading
            ? <Loader/>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

