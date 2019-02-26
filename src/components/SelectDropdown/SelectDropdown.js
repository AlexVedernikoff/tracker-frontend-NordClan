import React, { Component } from 'react';
import Select from 'react-select';
import { Option, Value } from './CustomComponents';
import './SelectDropdown.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './SelectDropdown.json';
import { ENTER } from '../../constants/KeyCodes';
import { isEmpty } from 'lodash';

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

  state = {
    isHovered: false
  };

  onClear() {
    if (this.props.onClear) {
      this.props.onClear();
    }
  }

  showCross() {
    this.setState({ isHovered: true });
  }

  hideCross() {
    this.setState({ isHovered: false });
  }

  isEmpty = value => {
    if (typeof value === 'object') {
      return isEmpty(value);
    } else if (value === 0) {
      return false;
    } else {
      return !value;
    }
  };

  render() {
    const { name, options, thisClassName, lang, canClear, ...other } = this.props;
    return (
      <div onMouseEnter={() => this.showCross()} onMouseLeave={() => this.hideCross()} className="InnerSelectWrap">
        <InnerSelect
          className={thisClassName}
          name={name}
          options={options}
          noResultsText={localize[lang].NO_RESULTS}
          onFocus={e => e.stopPropagation()}
          clearValueText={localize[lang].CLEAR}
          valueComponent={Value}
          optionComponent={Option}
          {...other}
        />

        {canClear &&
          !this.isEmpty(other.value) &&
          this.state.isHovered && (
            <span className="ClearValue" onClick={() => this.onClear()}>
              ×
            </span>
          )}
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
)(SelectDropdown);
