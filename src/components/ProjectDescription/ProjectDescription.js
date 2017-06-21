import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDescription.scss';
import { projectDescriptionText } from '../../mocks/descriptionText';
import { IconEdit, IconCheck } from '../Icons';
import TextEditor from '../TextEditor';

class ProjectDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: projectDescriptionText,
      editing: false
    };
  }

  toggleEditing = () => {
    if (this.state.editing) {
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
          ? <TextEditor content={this.state.text["__html"]} />
          : <div className="wiki" dangerouslySetInnerHTML={this.state.text} />}
      </div>
    );
  }
}

export default ProjectDescription;
