import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import * as css from './ProjectPage.scss';

export default class ProjectPage extends Component {
  static propTypes = {
  }

  render () {

    // Mocks
    const project = {
      name: 'MakeTalents',
      prefix: 'MT'
    };

    return (
      <div id="task-page">
        <h1>{project.name}</h1>
      </div>
    );
  }
}
