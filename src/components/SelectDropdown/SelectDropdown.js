import React, { Component } from 'react';
import Select from 'react-select';
import './SelectDropdown.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './SelectDropdown.json';
import { ENTER } from '../../constants/KeyCodes';

// workaround for submit on enter press
// we want key down event to propagate
// if dropdown is closed and if key is enter
// find more in react-select sources
class InnerSelect extends Select {
  handleKeyDown(event) {
    if (this.props.disabled) {
      return;
    }

    if (typeof this.props.onInputKeyDown === 'function') {
      this.props.onInputKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    if (event.keyCode === ENTER) {
      if (!this.state.isOpen) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.selectFocusedOption();
    } else {
      super.handleKeyDown(event);
    }
  }
}

class SelectDropdown extends Component {
  static propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { name, options, thisClassName, lang, ...other } = this.props;

    return (
      <InnerSelect
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
