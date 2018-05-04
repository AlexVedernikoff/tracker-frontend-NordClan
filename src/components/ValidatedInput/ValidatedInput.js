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
      onFocus: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.isError !== nextProps.shouldMarkError && this.setState({ isError: nextProps.shouldMarkError });
  }

  render() {
    const { onBlur, shouldMarkError, errorText, backendErrorText, ...other } = this.props;
    const { onFocus, isError } = this.state;

    return (
      <div className={validateCss.fullWrapper}>
        <input
          type="text"
          {...other}
          onBlur={() => {
            this.setState({ onFocus: false }, () => {
              onBlur() && this.setState({ isError: true });
            });
          }}
          onFocus={() => {
            this.setState({ onFocus: true });
          }}
          className={classnames(css.input, {
            [css.inputError]: (isError || backendErrorText) && !onFocus
          })}
        />
        {isError && !onFocus && <span className={css.message}>{errorText}</span>}
        {backendErrorText && !onFocus && <span>{backendErrorText}</span>}
      </div>
    );
  }
}

export default ValidatedInput;
