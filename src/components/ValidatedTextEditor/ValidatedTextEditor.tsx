import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextEditor from '../TextEditor';

import * as css from './ValidatedTextEditor.scss';

class ValidatedTextEditor extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isError: this.props.shouldMarkError,
      isBlur: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.isError !== nextProps.shouldMarkError && this.setState({ isError: nextProps.shouldMarkError });
  }

  onBlur = () => {
    const { onBlur } = this.props;
    this.setState({ isBlur: true });
    onBlur && onBlur();
  };

  render() {
    const { errorText, validator, onEditorStateChange, ...other } = this.props;
    const { isError, isBlur } = this.state;
    return (
      <div className={css.container}>
        <TextEditor {...other} onEditorStateChange={onEditorStateChange} onBlur={this.onBlur} validator={validator} />
        {isError && isBlur && <span className={classnames(css.message, css.error)}>{errorText}</span>}
      </div>
    );
  }
}

(ValidatedTextEditor as any).propTypes = {
  content: PropTypes.string,
  errorText: PropTypes.string,
  onBlur: PropTypes.func,
  onEditorStateChange: PropTypes.func,
  placeholder: PropTypes.string,
  shouldMarkError: PropTypes.bool,
  toolbarClassName: PropTypes.string,
  toolbarHidden: PropTypes.bool,
  validator: PropTypes.func
};

export default ValidatedTextEditor;
