import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import RouteTabs from '../../components/RouteTabs';
import { IconEdit } from '../../components/Icons';
import * as css from './ProjectPage.scss';
import ProjectTitle from "./ProjectTitle";

export default class ProjectPage extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  render () {

    // Mocks
    const project = {
      name: 'MakeTalents',
      prefix: 'MT',
      pic: 'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png',
      id: 1
    };

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="project-page">

          <ProjectTitle {...project} />

          <RouteTabs>
            <Link activeClassName="active" to={`/projects/${project.id}/agile-board`}>Доска</Link>
            <Link activeClassName="active" to={`/projects/${project.id}/info`}>Информация</Link>
            <Link activeClassName="active" to={`/projects/${project.id}/property`}>Настройки</Link>
            <Link activeClassName="active" to={`/projects/${project.id}/planning`}>Планирование</Link>
            <Link activeClassName="active" to={`/projects/${project.id}/analitics`}>Аналитика</Link>
            <Link activeClassName="active" to={`/projects/${project.id}/tasks`}>Задачи</Link>
          </RouteTabs>

          <div className={css.tabContent}>
            {this.props.children}
          </div>

        </div>
      </DragDropContextProvider>
    );
  }
}
