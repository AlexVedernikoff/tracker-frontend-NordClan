import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from '../Input/Input.scss';
import * as validateCss from './ValidatedInput.scss';

class ValidatedInput extends Component {
  static propTypes = {
    backendErrorText: PropTypes.string,
    errorText: PropTypes.string,
    onBlur: PropTypes.func,
    shouldMarkError: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isError: this.props.shouldMarkError,
      isFocused: false
    };
  }

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

  render() {
    /* eslint-disable no-unused-vars */
    const { errorText, backendErrorText, shouldMarkError, ...other } = this.props; //shouldMarkError попадает в инпут
    /* eslint-enable no-unused-vars*/
    const { isFocused, isError } = this.state;

    return (
      <div className={validateCss.fullWrapper}>
        <input
          type="text"
          {...other}
          onBlur={this.removeFocus}
          onFocus={this.onFocus}
          className={classnames(css.input, {
            [css.inputError]: (isError || backendErrorText) && !isFocused
          })}
        />
        {isError && !isFocused && <span className={css.message}>{errorText}</span>}
        {backendErrorText && !isFocused && <span>{backendErrorText}</span>}
      </div>
    );
  }
}

export default ValidatedInput;
