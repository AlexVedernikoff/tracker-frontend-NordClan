import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconEdit } from '../Icons';
import * as css from './ProjectTitle.scss';

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props, editing: false };
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

  changeTitle = (name, event) => {
    const change = {};
    change[name] = event.target.value;
    this.setState(change);
  };

  handleEnterClick = event => {
    if (this.state.editing && event.keyCode === 13) {
      event.preventDefault();
    }
  };

  outsideClickHandler = event => {
    if (this.state.editingTitle) {
      if (
        event.target !== this.refs.projectName &&
        event.target !== this.refs.projectPrefix
      ) {
        this.stopEditing();
      }
    }
  };

  // componentDidMount() {
  //   window.addEventListener('click', this.outsideClickHandler);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('click', this.outsideClickHandler);
  // }

  render() {
    return (
      <div className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        <span
          contentEditable={this.state.editing}
          onKeyDown={this.handleEnterClick}
        >
          {this.state.name}
        </span>
        <span className={css.prefix}>
          <span>(</span>
          <span
            contentEditable={this.state.editing}
            onKeyDown={this.handleEnterClick}
          >
            {this.state.prefix}
          </span>
          <span>)</span>
        </span>

        <IconEdit className={css.edit} onClick={this.editIconClickHandler} />
      </div>
    );
  }
}

ProjectTitle.propTypes = {
  name: PropTypes.string.isRequired,
  pic: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired
};
