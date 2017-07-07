import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import RouteTabs from '../../components/RouteTabs';
import { IconEdit } from '../../components/Icons';
import * as css from './ProjectPage.scss';
import ProjectTitle from './ProjectTitle';

import { GetProjectInfo } from '../../actions/Project';
import {
  ChangeProject,
  StartEditing,
  StopEditing
} from '../../actions/Project';

class ProjectPage extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { GetProjectInfo, GetProjectSprints } = this.props;
    GetProjectInfo(this.props.params.projectId);
  }

  render () {
    // Mocks
    const pic
      = 'https://static.qiwi.com/img/qiwi_com/favicon/favicon-192x192.png';

    return (
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
    );
  }
}

ProjectPage.propTypes = {
  children: PropTypes.object,
  GetProjectInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.Project.project
});

const mapDispatchToProps = {
  GetProjectInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
