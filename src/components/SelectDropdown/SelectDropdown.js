import React, { Component } from 'react';
import Select from 'react-select';
import './SelectDropdown.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './SelectDropdown.json';

class SelectDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { name, options, thisClassName, noResultsText, lang, ...other } = this.props;

    return (
      <Select
        className={thisClassName}
        name={name}
        options={options}
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
