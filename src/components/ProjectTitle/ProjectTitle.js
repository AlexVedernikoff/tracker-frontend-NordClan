import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconEdit } from "../Icons";
import * as css from "./ProjectTitle.scss";
import { RIEInput } from "riek";
import _ from "lodash";

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props, editingTitle: false };

    this.toggleTitleEditing = this.toggleTitleEditing.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  toggleTitleEditing() {
    this.setState({ editingTitle: !this.state.editingTitle });
  }

  changeTitle(name, e) {
    const change = {};
    change[name] = e.target.value;
    this.setState(change);
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      this.setState({editingTitle : false});
    } else if (e.keyCode === 27) {
      this.setState({editingTitle : false, name: this.props.name, prefix: this.props.prefix})
    }
  }

  render() {
    return (
      <div className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        {this.state.editingTitle
          ? <input
              name="name"
              onKeyDown={this.keyDown}
              value={this.state.name}
              onChange={this.changeTitle.bind(this, "name")}
            />
          : <span>{this.state.name}</span>}

        {this.state.editingTitle
          ? <input
              name="prefix"
              onKeyDown={this.keyDown}
              value={this.state.prefix}
              onChange={this.changeTitle.bind(this, "prefix")}
            />
          : <span className={css.prefix}>
              ({this.state.prefix})
            </span>}
        <IconEdit className={css.edit} onClick={this.toggleTitleEditing} />
      </div>
    );
  }
}
