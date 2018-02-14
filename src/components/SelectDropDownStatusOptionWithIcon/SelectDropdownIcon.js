import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './icon.scss';

export default class statusOption extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object.isRequired
  };
  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };
  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  };
  handleMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  };

  statusProgress = () => {
    if (this.props.option.value.statusId === 1) {
      return <span className={css.sprintMarker} />;
    }
    if (this.props.option.value.statusId === 2) {
      return <span className={css.sprintMarker + ' ' + css.INPROGRESS} />;
    }
    if (this.props.option.value.statusId === 0) {
      return <span className={css.sprintMarker + ' ' + css.FINISHED} />;
    }
  };

  render () {
    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
      >
        {this.statusProgress()}
        {this.props.children}
      </div>
    );
  }
}
