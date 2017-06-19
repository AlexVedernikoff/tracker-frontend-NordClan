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
  }

  toggleTitleEditing() {
    this.setState({ editingTitle: !this.state.editingTitle });
  }

  changeTitle(name, e) {
    const change = {};
    change[name] = e.target.value;
    this.setState(change);
  }

  render() {
    return (
      <div className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        {this.state.editingTitle
          ? <input name="name" value={this.state.name} onChange={this.changeTitle.bind(this, 'name')} />
          : <span>{this.state.name}</span>}

        {this.state.editingTitle
          ? <input name="prefix" value={this.state.prefix} onChange={this.changeTitle.bind(this, 'prefix')} />
          : <span className={css.prefix}>
              ({this.state.prefix})
            </span>}
        <IconEdit className={css.edit} onClick={this.toggleTitleEditing} />
      </div>
    );
  }
}
