import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';

import RouteTabs from '../../components/RouteTabs';
import AgileBoard from './AgileBoard';
import * as css from './ProjectPage.scss';

export default class ProjectPage extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  render () {

    // Mocks
    const project = {
      name: 'MakeTalents',
      pic: 'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png',
      id: 1
    };

    return (
      <div id="project-page">
        <h1 className={css.projectTitle}><img src={project.pic} className={css.projectPic}/>{project.name}</h1>
        <RouteTabs>
          <Link activeClassName="active" to={`/projects/${project.id}/agile-board`}>Доска</Link>
          <Link activeClassName="active" to={`/projects/${project.id}/info`}>Описание и файлы</Link>
          <Link activeClassName="active" to={`/projects/${project.id}/property`}>Настройки</Link>
        </RouteTabs>
        {this.props.children}
      </div>
    );
  }
}
