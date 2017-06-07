import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Input.scss';

export default class Input extends Component {
  static propTypes = {
  };

  render () {
    const {
      ...other
    } = this.props;

    return (
      <input type="text" {...other} className={css.input}/>
    );
  }
}
