import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import * as css from './TextArea.scss';

export default class TextArea extends Component {
  static propTypes = {};

  render() {
    return <textarea {...this.props} className={cn(css.textarea, this.props.className)} ref="input" />;
  }
}

TextArea.propTypes = {
  value: PropTypes.string
};
