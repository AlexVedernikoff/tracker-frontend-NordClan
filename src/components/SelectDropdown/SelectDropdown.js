import React, { Component } from 'react';
import Select from 'react-select';
import './SelectDropdown.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './SelectDropdown.json';

const ru = require('convert-layout/ru');

class SelectDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  layoutAgnosticFilter = (option, filter) => {
    const filterValue = filter.toLowerCase().trim();
    const testValue = option.label.toLowerCase().trim();
    if (typeof testValue === 'string') {
      return (
        testValue.indexOf(filterValue) === 0 ||
        testValue.indexOf(ru.toEn(filterValue)) === 0 ||
        testValue.indexOf(ru.fromEn(filterValue)) === 0
      );
    }
  };

  render() {
    const { name, options, thisClassName, noResultsText, lang, ...other } = this.props;

    return (
      <Select
        className={thisClassName}
        name={name}
        options={options}
        filterOption={name === 'filterTags' || name === 'changedSprint' ? this.layoutAgnosticFilter : null}
        noResultsText={localize[lang].NO_RESULTS}
        onFocus={e => e.stopPropagation()}
        clearValueText={localize[lang].CLEAR}
        {...other}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(SelectDropdown);
