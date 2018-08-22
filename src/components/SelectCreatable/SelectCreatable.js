import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import './SelectCreatable.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './SelectCreatable.json';

class SelectCreatable extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { name, options, thisClassName, noResultsText, lang, ...other } = this.props;

    return (
      <CreatableSelect
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
)(SelectCreatable);
