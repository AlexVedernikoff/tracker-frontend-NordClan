import React, { Component } from 'react';
import Select from 'react-select';
import './CreatableMulti.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './CreatableMulti.json';

const ru = require('convert-layout/ru');

class CreatableMulti extends Component {
  static propTypes = {
    hint: PropTypes.string,
    label: PropTypes.string,
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
    const { options, onChange, value, lang, noResultsText, ...other } = this.props;

    return (
      <div>
        <Select.Creatable
          multi
          showNewOptionAtTop
          options={options}
          onChange={onChange}
          value={value}
          promptTextCreator={label => `${localize[lang].CREATE_NEW_OPTION}: ${label}`}
          noResultsText={localize[lang].NO_RESULTS}
          filterOption={this.layoutAgnosticFilter}
          {...other}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(CreatableMulti);
