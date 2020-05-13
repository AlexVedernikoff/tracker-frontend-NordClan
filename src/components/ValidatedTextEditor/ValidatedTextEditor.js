import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextEditor from '../TextEditor';

import * as css from './ValidatedTextEditor.scss';

class ValidatedTextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: this.props.shouldMarkError
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.isError !== nextProps.shouldMarkError && this.setState({ isError: nextProps.shouldMarkError });
  }

  onBlur = () => {
    const { onBlur } = this.props;
    this.setState({ isError: true });
    onBlur && onBlur();
  };

  render() {
    const { errorText, validator, onEditorStateChange, ...other } = this.props;
    const { isError } = this.state;
    return (
      <div className={css.container}>
        <TextEditor {...other} onEditorStateChange={onEditorStateChange} onBlur={this.onBlur} validator={validator} />
        {isError && <span className={classnames(css.message, css.error)}>{errorText}</span>}
      </div>
    );
  }
}

ValidatedTextEditor.propTypes = {
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
