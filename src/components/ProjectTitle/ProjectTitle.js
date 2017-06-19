import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconEdit } from "../Icons";
import * as css from "./ProjectTitle.scss";

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props, editingTitle: false };
  }

  editIconClickHandler = () => {
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

  changeTitle = (name, e) => {
    const change = {};
    change[name] = e.target.value;
    this.setState(change);
  };

  keyDown = e => {
    if (e.keyCode === 13) {
      this.setState({ editingTitle: false });
    } else if (e.keyCode === 27) {
      this.setState({
        editingTitle: false,
        name: this.props.name,
        prefix: this.props.prefix
      });
    }
  };

  onblurHandler = e => {
    if (this.state.editingTitle) {
      if (
        e.target !== this.refs.projectName &&
        e.target !== this.refs.projectPrefix &&
        e.target.tagName !== "svg"
      ) {
        this.setState({ editingTitle: false });
      }
    }
  };

  componentDidMount() {
    window.addEventListener("click", this.onblurHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onblurHandler);
  }

  render() {
    if (this.state.editingTitle) {
      window.addEventListener("click", this.onblurHandler);
    }
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
