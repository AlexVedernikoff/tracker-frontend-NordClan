import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select, { Creatable } from '../Select';
import { ENTER } from '../../constants/KeyCodes';
import { Option, Value } from './CustomComponents';
import localize from './SelectDropdown.json';

// workaround for submit on enter press
// we want key down event to propagate
// if dropdown is closed and if key is enter
// find more in react-select sources

interface InnerSelectProps {
  onInputKeyDown?
  disabled?
  className
  name
  options
  noResultsText
  onFocus
  onBlur
  clearValueText
  valueComponent
  optionComponent
}

class InnerSelect extends (Select as React.ComponentClass<InnerSelectProps>) {
  selectFocusedOption!: Function

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
      // @ts-expect-error
      super.handleKeyDown(event);
    }
  }
}

interface InnerSelectCreatableProps {
  onInputKeyDown?
  disabled?
  className
  name
  options
  noResultsText
  onFocus
  onBlur
  clearValueText
  valueComponent
  optionComponent
}

class InnerSelectCreatable extends (Creatable as React.ComponentClass<InnerSelectCreatableProps>) {
  selectFocusedOption!: Function

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
      // @ts-expect-error
      super.handleKeyDown(event);
    }
  }
}

interface Props {
  onClear?: () => void
  name: string
  lang: string
  canClear: boolean
  creatable: boolean
  thisClassName: string
  options: any[]
  value?
}

interface State {
}

class SelectDropdown extends Component<Props, State> {
  static propTypes = {
    creatable: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.array
  };

  state = {
    isFocused: false,
  };

  onClear() {
    if (this.props.onClear) {
      this.props.onClear();
    }
  }

  showCross(e) {
    e.stopPropagation()
    this.setState({ isFocused: true });
  }

  hideCross(e) {
    e.stopPropagation()
    this.setState({ isFocused: false });
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
    const { name, options, thisClassName, lang, canClear, creatable, ...other } = this.props;
    return (
      <div className="InnerSelectWrap">
        {creatable ? (
          <InnerSelectCreatable
            className={thisClassName}
            name={name}
            options={options}
            noResultsText={localize[lang].NO_RESULTS}
            onFocus={e => this.showCross(e)}
            onBlur={e => this.hideCross(e)}
            clearValueText={localize[lang].CLEAR}
            valueComponent={Value}
            optionComponent={Option}
            {...other}
          />
        ) : (
          <InnerSelect
            className={thisClassName}
            name={name}
            options={options}
            noResultsText={localize[lang].NO_RESULTS}
            onFocus={e => this.showCross(e)}
            onBlur={e => this.hideCross(e)}
            clearValueText={localize[lang].CLEAR}
            valueComponent={Value}
            optionComponent={Option}
            {...other}
          />
        )}
        {canClear &&
          !this.isEmpty(other.value) &&
          !this.state.isFocused && (
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
