import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit, IconCheck } from '../../../components/Icons';

class TaskTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ...props,
      editing: false,
      loading: false,
      submitError: false
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

  validateAndSubmit = event => {
    event.target.innerText = event.target.innerText.trim();
    if (event.target.innerText.length < 4) {
      this.setState({ submitError: true });
    } else {
      this.setState({
        submitError: false,
        editing: false,
        name: event.target.innerText
      });
    }
  };

  handleKeyPress = event => {
    if (event.target.innerText.length > 300) {
      // TODO: add exceptions for backspace and other needed keys
      event.preventDefault();
    }

    if (this.state.editing && event.keyCode === 13) {
      event.preventDefault();
      this.validateAndSubmit(event);
    } else if (event.keyCode === 27) {
      event.target.innerText = this.state.name;
      this.setState({
        editing: false,
        submitError: false
      });
    }
  };

  render () {
    return (
      <div className={css.title}>
        <h1 className={css.titleWrapper}>
          <span
            className={classnames({
              [css.taskName]: true,
              [css.wrong]: this.state.submitError
            })}
            contentEditable={this.state.editing}
            onBlur={this.validateAndSubmit}
            onKeyDown={this.handleKeyPress}
            onInput={this.titleChangeHandler}
          >
            {this.props.name}
          </span>
          {this.state.editing
            ? <IconCheck
                onClick={this.editIconClickHandler}
                className={css.save}
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
