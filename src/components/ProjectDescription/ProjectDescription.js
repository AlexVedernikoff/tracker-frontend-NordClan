import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDescription.scss';
import { projectDescriptionText } from "../../mocks/descriptionText";

class ProjectDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: projectDescriptionText
    };
  }

  render() {
    return (
      <div className={css.projectDesc}>
        <h2>Описание</h2>
        <div className="wiki" dangerouslySetInnerHTML={this.state.text} />
    </div>
    );
  }
}

export default ProjectDescription;
