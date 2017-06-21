import React, { Component } from 'react';
import PropTypes from "prop-types";

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content;
    };
  }

  render() {
    return (
      <div></div>
    );
  }

}

export default TextEditor;
