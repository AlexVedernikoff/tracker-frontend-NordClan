import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import * as css from '../Input/Input.scss';
import * as validateCss from './ValidatedInput.scss';

class ValidatedInput extends Component<any, any> {
  static propTypes = {
    backendErrorText: PropTypes.string,
    errorText: PropTypes.string,
    onBlur: PropTypes.func,
    shouldMarkError: PropTypes.bool
  };

  elemRef!: any

  constructor(props) {
    super(props);
    this.state = {
      isError: this.props.shouldMarkError,
      isFocused: false
    };
  }

  componentDidMount = () => {
    if (this.props.onRef) {
      this.props.onRef(this.elemRef);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.isError !== nextProps.shouldMarkError) {
      this.setState({ isError: nextProps.shouldMarkError });
    }
  }

  removeFocus = () => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false }, () => {
      onBlur() && this.setState({ isError: true });
    });
  };

  onFocus = () => {
    this.setState({ isFocused: true });
  };

  get elem() {
    /* eslint-disable no-unused-vars */
    const { isErrorBack, errorText, backendErrorText, shouldMarkError, elementType, ...other } = this.props;
    const { isFocused, isError } = this.state;
    const elems = {
      input: (
        <input
          type="text"
          {...other}
          ref={elem => (this.elemRef = elem)}
          onBlur={this.removeFocus}
          onFocus={this.onFocus}
          className={classnames(css.input, {
            [css.inputError]: (isErrorBack || backendErrorText || isError) && !isFocused
          })}
        />
      ),
      date: (
        <DatepickerDropdown
          {...other}
          onBlur={this.removeFocus}
          onFocus={this.onFocus}
          className={classnames(css.input, {
            [css.inputError]: (isErrorBack || backendErrorText || isError) && !isFocused,
            error: (isErrorBack || backendErrorText) && !isFocused
          })}
        />
      )
    };

    return elems[elementType] || elems.input;
  }

  render() {
    const { errorText, backendErrorText, isErrorBack } = this.props;
    const { isFocused, isError } = this.state;

    return (
      <div className={validateCss.fullWrapper}>
        {this.elem}
        {errorText && isError && !backendErrorText && !isFocused && <span className={classnames(css.message, css.error)}>{errorText}</span>}
        {backendErrorText && !isFocused && isErrorBack && <span>{backendErrorText}</span>}
      </div>
    );
  }
}

export default ValidatedInput;
