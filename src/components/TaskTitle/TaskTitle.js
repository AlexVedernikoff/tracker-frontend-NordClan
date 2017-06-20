import React, { Component } from 'react';
import classnames from "classnames";
import PropTypes from 'prop-types';
import * as css from './TaskTitle.scss';
import { IconEdit, IconCheck } from '../Icons';

class TaskTitle extends Component {
  constructor(props) {
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
    if (event.target.innerHTML.length < 4) {
      this.setState({ submitError: true });
    } else {
      this.setState({
        submitError: false,
        editing: false,
        name: event.target.innerText
      });
    }
  };

  handleEnterClick = event => {
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

  render() {
    // const style = {
    //   backgroundColor: '#f46542'
    // };

    return (
      <div className={css.title}>
        <h1>
          <span
            className={
              classnames({ [css.projectName]: true, [css.wrong] : this.state.submitError})
            }
            contentEditable={this.state.editing}
            onBlur={this.validateAndSubmit}
            onKeyDown={this.handleEnterClick}
            onInput={this.titleChangeHandler}
            // style={this.state.submitError ? style : {}}
          >
            {this.state.name}
          </span>
          {this.state.editing
            ? <IconCheck
                onClick={this.editIconClickHandler}
                className={css.edit + " " + css.submitIcon}
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
