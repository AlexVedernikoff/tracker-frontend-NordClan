import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './TextArea.scss';

export default class TextArea extends Component<any, any> {
  static propTypes = {
  };

  render () {
    return (
      <textarea {...this.props} className={css.textarea} ref="input" />
    );
  }
}

(TextArea as any).propTypes = {
  value: PropTypes.string
};
