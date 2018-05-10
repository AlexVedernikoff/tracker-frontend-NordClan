import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconPreloader } from '../Icons';

import * as css from './RoundButton.scss';

class RoundButton extends Component {
  static propTypes = {
    children: PropTypes.object,
    className: PropTypes.string,
    loading: PropTypes.bool
  };

  render() {
    const { className, loading, ...other } = this.props;

    return (
      <button className={classnames([css.button, className])} {...other}>
        {loading ? <IconPreloader /> : this.props.children}
      </button>
    );
  }
}

export default RoundButton;
