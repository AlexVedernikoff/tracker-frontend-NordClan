import React, { Component } from 'react';
import Select from 'react-select';
import './SelectDropdown.css';
import PropTypes from 'prop-types';

export default class SelectDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { name, options, thisClassName, noResultsText, ...other } = this.props;

    return (
      <Select
        className={thisClassName}
        name={name}
        options={options}
        noResultsText="Ничего не найдено"
        onFocus={e => e.stopPropagation()}
        clearValueText="Очистить"
        {...other}
      />
    );
  }
}
