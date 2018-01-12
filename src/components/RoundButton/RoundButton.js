import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from './RoundButton.scss';

class RoundButton extends Component {
  static propTypes = {
    children: PropTypes.object,
    className: PropTypes.string
  }

  render () {
    const {
      className,
      ...other
    } = this.props;

    return (
      <div className={classnames([css.button, className])} {...other}>
        {this.props.children}
      </div>
    );
  }
}

export default RoundButton;
