import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconEdit } from "../Icons";
import * as css from "./ProjectTitle.scss";

export default class ProjectTitle extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return (
      <h1 className={css.projectTitle}>
        <img src={this.state.pic} className={css.projectPic} />
        {this.state.name}
        <span className={css.prefix}>
          ({this.state.prefix})
        </span>
        <IconEdit className={css.edit} />
      </h1>
    );
  }
}
