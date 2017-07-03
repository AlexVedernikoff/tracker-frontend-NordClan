import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import { connect } from 'react-redux';

import RouteTabs from '../../components/RouteTabs';
import { IconEdit } from '../../components/Icons';
import * as css from './ProjectPage.scss';
import ProjectTitle from './ProjectTitle';

import GetProjectInfo from '../../actions/GetProjectInfo';

class ProjectPage extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(GetProjectInfo(this.props.params.projectId));
  }

  render () {
    // Mocks
    const pic
      = 'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png';

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="project-page">
          <ProjectTitle
            pic={pic}
            name={this.props.project.name || ''}
            prefix={this.props.project.prefix || ''}
            id={this.props.project.id || ''}
          />

          <RouteTabs>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/agile-board`}
            >
              Доска
            </Link>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/tasks`}
            >
              Список задач
            </Link>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/planning`}
            >
              Планирование
            </Link>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/info`}
            >
              Информация
            </Link>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/property`}
            >
              Настройки
            </Link>
            <Link
              activeClassName="active"
              to={`/projects/${this.props.params.projectId}/analitics`}
            >
              Аналитика
            </Link>
          </RouteTabs>

          <div className={css.tabContent}>
            {this.props.children}
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

ProjectPage.propTypes = {
  children: PropTypes.object
};

const mapStateToProps = state => ({
  project: state.ProjectInfo.project
});

export default connect(mapStateToProps)(ProjectPage);
