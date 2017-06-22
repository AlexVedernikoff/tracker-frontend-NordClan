import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Description.scss';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';
import { stateToHTML } from 'draft-js-export-html';

class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      editing: false
    };
  }

  toggleEditing = () => {
    if (this.state.editing) {
      this.updateText();
      this.stopEditing();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  checkEscapeKeyPress = (event) => {
    if (event.keyCode === 27 && this.state.editing) {
      this.stopEditing();
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.checkEscapeKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkEscapeKeyPress);
  }

  updateText = () => {
    this.setState({
      text: { __html: stateToHTML(this.TextEditor.state.editorState.getCurrentContent()) }
    });
  };

  render() {
    return (
      <div className={css.projectDesc}>
        <h2>
          Описание{' '}
          {this.state.editing
            ? <IconCheck className={css.edit} onClick={this.toggleEditing} />
            : <IconEdit className={css.edit} onClick={this.toggleEditing} />}
        </h2>
        {this.state.editing
          ? <TextEditor
              ref={ref => (this.TextEditor = ref)}
              content={this.state.text['__html']}
            />
          : <div className="wiki" dangerouslySetInnerHTML={this.state.text} />}
      </div>
    );
  }
}

export default Description;
