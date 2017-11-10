import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Input.scss';

export default class Input extends Component {
  static propTypes = {
    isNotValid: PropTypes.bool
  };

  render () {
    const { isNotValid, ...other } = this.props;
    return (
      <input
        type="text"
        {...other}
        className={classnames(css.input, {
          [css.inputError]: isNotValid
        })}
      />
    );
  }
}
