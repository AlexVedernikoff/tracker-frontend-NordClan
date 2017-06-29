import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TextArea.scss';

export default class TextArea extends Component {
  static propTypes = {
  };

  render () {
    const {
      value,
      ...other
    } = this.props;

    return (
      <textarea {...other} className={css.textarea}>{value}</textarea>
    );
  }
}

TextArea.propTypes = {
  value: PropTypes.string
};
