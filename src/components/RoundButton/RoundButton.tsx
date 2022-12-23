import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconPreloader } from '../Icons';

import css from './RoundButton.scss';

class RoundButton extends Component<any, any> {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
