import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit, IconCheck } from '../Icons';

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

  handleEnterClick = event => {
    if (this.state.editing && event.keyCode === 13) {
      event.preventDefault();
      this.setState({ name: event.target.innerHTML });
      this.stopEditing();
    }
  };

  render() {
    return (
      <div className={css.title}>
        <h1>
          <span
            className={css.projectName}
            contentEditable={this.state.editing}
            onBlur={this.stopEditing}
            onKeyDown={this.handleEnterClick}
            onInput={this.titleChangeHandler}
          >
            {this.state.name}
          </span>
          {this.state.editing
            ? <IconCheck
                onClick={this.editIconClickHandler}
                className={css.edit}
              />
            : <IconEdit
                onClick={this.editIconClickHandler}
                className={css.edit}
              />}
        </h1>
      </div>
    );
  }
}

export default TaskTitle;
