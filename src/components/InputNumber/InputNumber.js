import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './InputNumber.scss';

class InputNumber extends Component {
  static propTypes = {
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string
  };

  formatValue = e => {
    const value = e.target.value;
    let formattedValue = +value;
    const { min, max } = this.props;
    if (min && formattedValue && value < min) formattedValue = min;
    if (max && formattedValue && value > max) formattedValue = max;
    this.props.onChange(formattedValue);
  };

  render() {
    const { onChange, value, ...other } = this.props;
    return <input onChange={this.formatValue} value={value} type="number" {...other} className={css.input} />;
  }
}

export default InputNumber;
