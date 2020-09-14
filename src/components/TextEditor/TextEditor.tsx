import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html'; // fix 7278 and leave empty lines
import './TextEditor.css';
import classnames from 'classnames';
import * as css from './TextEditor.scss';

class CustomEditor extends Editor {
  focusEditor = () => {
    setTimeout(() => {
      this.editor && this.editor.focus();
    });
  };

  componentDidMount() {
    if (this.props.onBlur) this.focusEditor();
  }
}

class TextEditor extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(stateFromHTML(this.props.content))
    };
  }

  onEditorStateChange = editorState => {
    const { onEditorStateChange } = this.props;
    this.setState({
      editorState
    });
    this.validate(editorState);
    onEditorStateChange && onEditorStateChange(editorState);
  };

  validate = editorState => {
    const { validator } = this.props;
    validator && validator(editorState.getCurrentContent().getPlainText());
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { toolbarHidden, onEditorStateChange, placeholder, onBlur, ...other } = this.props;
    return (
      <CustomEditor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        toolbarHidden={toolbarHidden}
        placeholder={placeholder}
        stripPastedStyles
        onBlur={onBlur}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'history']
        }}
        toolbarClassName={classnames({ [css.hidden]: toolbarHidden })}
        {...other}
      />
    );
  }
}

TextEditor.propTypes = {
  content: PropTypes.string,
  onBlur: PropTypes.func,
  onEditorStateChange: PropTypes.func,
  placeholder: PropTypes.string,
  toolbarClassName: PropTypes.string,
  toolbarHidden: PropTypes.bool,
  validator: PropTypes.func
};

export default TextEditor;
