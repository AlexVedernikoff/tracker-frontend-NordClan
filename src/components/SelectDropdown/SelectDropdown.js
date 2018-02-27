import React, { Component } from 'react';
import Select from 'react-select';
import './SelectDropdown.css';
import PropTypes from 'prop-types';

export default class SelectDropdown extends Component {
  static propTypes = {
    inputCanBeEmpty: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.array
  };

  static defaultProps = {
    inputCanBeEmpty: true
  };

  onInputKeyDown(event) {
    const isEmpty = event.target.value ? event.target.value.length === 0 : true;
    if (!this.props.inputCanBeEmpty && event.keyCode === 8 && isEmpty) {
      event.preventDefault();
      return false;
    }
  }

  render() {
    const { name, options, thisClassName, noResultsText, ...other } = this.props;

    return (
      <Select
        className={thisClassName}
        name={name}
        options={options}
        noResultsText="Ничего не найдено"
        onInputKeyDown={e => this.onInputKeyDown(e)}
        onFocus={e => e.stopPropagation()}
        {...other}
      />
    );
  }
}
