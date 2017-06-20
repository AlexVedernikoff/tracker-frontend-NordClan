import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconEdit } from "../Icons";
import * as css from "./ProjectTitle.scss";

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props, editingTitle: false };
  }

  editIconClickHandler = (event) => {
    event.stopPropagation();
    if (this.state.editingTitle) {
      this.stopEditing();
    } else {
      this.startEditing();
    }
  };

  startEditing = () => {
    this.setState({ editingTitle: true });
  };

  stopEditing = () => {
    this.setState({ editingTitle: false });
  };

  changeTitle = (name, event) => {
    const change = {};
    change[name] = event.target.value;
    this.setState(change);
  };

  keyDown = event => {
    if (event.keyCode === 13) {
      this.setState({ editingTitle: false });
    } else if (event.keyCode === 27) {
      this.setState({
        editingTitle: false,
        name: this.props.name,
        prefix: this.props.prefix
      });
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

  componentDidMount() {
    window.addEventListener("click", this.outsideClickHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.outsideClickHandler);
  }

  render() {
    return (
      <div className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        {this.state.editingTitle
          ? <input
              ref="projectName"
              onKeyDown={this.keyDown}
              value={this.state.name}
              onChange={this.changeTitle.bind(this, "name")}
            />
          : <span>{this.state.name}</span>}

        <span className={css.prefix}>
          ({this.state.editingTitle
            ? <input
                ref="projectPrefix"
                onKeyDown={this.keyDown}
                value={this.state.prefix}
                onChange={this.changeTitle.bind(this, "prefix")}
              />
            : this.state.prefix})
        </span>

        <IconEdit className={css.edit} onClick={this.editIconClickHandler} />
      </div>
    );
  }
}
