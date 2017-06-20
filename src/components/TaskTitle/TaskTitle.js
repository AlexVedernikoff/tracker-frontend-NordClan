import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit } from '../Icons';

class TaskTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      editing: false
    };
  }

  editIconClickHandler = event => {
    event.stopPropagation();
    if (this.state.editingTitle) {
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
      <div className={css.title}>
        <h1 contentEditable={this.state.editing} onBlur={this.stopEditing}>
          {this.state.name}
          <IconEdit onClick={this.editIconClickHandler} className={css.edit} />
        </h1>
      </div>
    );
  }
}

export default TaskTitle;
