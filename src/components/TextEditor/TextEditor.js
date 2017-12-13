import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
require('./TextEditor.css');

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
    return (
      <Editor
        editorState={this.state.editorState}
        onEditorStateChange={this.onEditorStateChange}
        toolbarHidden = {this.props.toolbarHidden}
        placeholder = {this.props.placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'history']
        }}
      />
    );
  }
}

TextEditor.propTypes = {
  content: PropTypes.string
};

export default TextEditor;
