import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
require('./textEditor.css');

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(this.props.content))
      ),
      contentState: ContentState.createFromBlockArray(
        convertFromHTML(this.props.content)
      )
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState, contentState: editorState.getCurrentContent()
    });
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'history']
        }}
      />
    );
  }
}

export default TextEditor;
