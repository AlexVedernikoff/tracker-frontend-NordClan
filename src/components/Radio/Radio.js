import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './Radio.scss';

class Radio extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  };

  onChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.checked);
    }
  };

  render() {
    const { label, onChange, value, checked, name, ...other } = this.props;

    return (
      <label className={css.container} {...other}>
        <input type="radio" onChange={this.onChange} checked={checked} value={value} name={name} />
        <span className={css.pseudoRadio} />
        <span className={css.label}>{label}</span>
      </label>
    );
  }
}

export default Radio;
