import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import './TextEditor.css';
import * as css from './TextEditor.scss';

class TextEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(this.props.content))
      )
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  render () {
    const {
      toolbarHidden,
      placeholder,
      ...other
    } = this.props;
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        toolbarHidden={toolbarHidden}
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'history']
        }}
        {...other}
      />
    );
  }
}

TextEditor.propTypes = {
  content: PropTypes.string,
  placeholder: PropTypes.string,
  toolbarClassName: PropTypes.string,
  toolbarHidden: PropTypes.bool
};

export default TextEditor;
