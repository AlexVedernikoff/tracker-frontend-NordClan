import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IconEdit, IconCheck } from '../Icons';
import * as css from './ProjectTitle.scss';

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      editing: false,
      prefixIsIncorrect: false,
      nameIsIncorrect: false
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

  validateSubmit = () => {
    this.projectName.innerText = this.projectName.innerText.trim();
    this.projectPrefix.innerText = this.projectPrefix.innerText.trim();

    if (this.projectName.innerText.length < 4) {
      this.setState({ nameIsIncorrect: true });
      return false;
    } else {
      this.setState({ nameIsIncorrect: false });
    }

    if (this.projectPrefix.innerText.length < 2) {
      this.setState({ prefixIsIncorrect: true });
      return false;
    } else {
      this.setState({ prefixIsIncorrect: false });
    }
  };

  handleEnterClick = event => {
    if (this.state.editing && event.keyCode === 13) {
      event.preventDefault();
      this.validateSubmit();
    }
  };

  outsideClickHandler = event => {
    if (this.state.editing) {
      if (
        event.target !== this.projectName &&
        event.target !== this.projectPrefix
      ) {
        this.validateSubmit()
      }
    }
  };

  componentDidMount() {
    window.addEventListener('click', this.outsideClickHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outsideClickHandler);
  }

  render() {
    return (
      <div className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        <span
          id="projectName"
          className={this.state.nameIsIncorrect ? css.wrong : ''}
          ref={ref => (this.projectName = ref)}
          contentEditable={this.state.editing}
          onKeyDown={this.handleEnterClick}
        >
          {this.state.name}
        </span>
        <span className={css.prefix}>
          <span>(</span>
          <span
            id="projectPrefix"
            className={this.state.prefixIsIncorrect ? css.wrong : ''}
            ref={ref => (this.projectPrefix = ref)}
            contentEditable={this.state.editing}
            onKeyDown={this.handleEnterClick}
          >
            {this.state.prefix}
          </span>
          <span>)</span>
        </span>
        {this.state.editing
          ? <IconCheck
              className={css.edit}
              onClick={this.editIconClickHandler}
            />
          : <IconEdit
              className={css.edit}
              onClick={this.editIconClickHandler}
            />}
      </div>
    );
  }
}

ProjectTitle.propTypes = {
  name: PropTypes.string.isRequired,
  pic: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired
};
