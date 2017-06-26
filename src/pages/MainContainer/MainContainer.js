import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './MainContainer.scss';

export default class MainContainer extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render () {
    return (
      <div id="app">
        {this.props.children}
      </div>
    );
  }
}
