import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TextArea.scss';

export default class TextArea extends Component {
  static propTypes = {
  };

  render () {
    return (
      <textarea {...this.props} className={css.textarea} ref="input" />
    );
  }
}

TextArea.propTypes = {
  value: PropTypes.string
};
