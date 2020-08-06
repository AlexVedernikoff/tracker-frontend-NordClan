import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from '../Input/Input.scss';
import * as validateCss from '../ValidatedInput/ValidatedInput.scss';
import TextareaAutosize from 'react-autosize-textarea';
import { ENTER } from '../../constants/KeyCodes';

class ValidatedAutosizeInput extends Component {
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
      showSpan: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.isError !== nextProps.shouldMarkError && this.setState({ isError: nextProps.shouldMarkError });
  }

  handleKeyDown = e => {
    const { onKeyDown, onEnter } = this.props;

    if (onKeyDown) {
      onKeyDown(e);
      return;
    }

    if (!onEnter) {
      return;
    }

    if (e.keyCode === ENTER) {
      e.preventDefault();
      onEnter();
    }
  };

  render() {
    const { onBlur, errorText, backendErrorText, ...other } = this.props;
    return (
      <div className={validateCss.fullWrapper}>
        <TextareaAutosize
          {...other}
          onKeyDown={this.handleKeyDown}
          onBlur={() => {
            onBlur() && this.setState({ isError: true, showSpan: true });
          }}
          onFocus={() => this.setState({ showSpan: false })}
          className={classnames(css.input, {
            [css.inputError]: this.state.isError || backendErrorText
          })}
        />
        {this.state.showSpan && <span className={css.message}>{errorText}</span>}
        {backendErrorText && <span>{backendErrorText}</span>}
      </div>
    );
  }
}

export default ValidatedAutosizeInput;
