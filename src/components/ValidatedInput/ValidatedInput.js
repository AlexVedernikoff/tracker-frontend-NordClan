import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from '../Input/Input.scss';
import * as validateCss from './ValidatedInput.scss';

class ValidatedInput extends Component {
  static propTypes = {
    errorText: PropTypes.string,
    onBlur: PropTypes.func,
    shouldMarkError: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      isError: this.props.shouldMarkError
    };
  }

  componentWillReceiveProps (nextProps) {
    this.state.isError !== nextProps.shouldMarkError
      && this.setState({ isError: nextProps.shouldMarkError });
  }

  render () {
    const { onBlur, shouldMarkError, errorText, ...other } = this.props;
    return (
      <div className={validateCss.fullWrapper}>
        <input
          type="text"
          {...other}
          onBlur={() => {
            onBlur() && this.setState({ isError: true });
          }}
          className={classnames(css.input, {
            [css.inputError]: this.state.isError
          })}
        />
        {this.state.isError && <span>{errorText}</span>}
      </div>
    );
  }
}

export default ValidatedInput;
