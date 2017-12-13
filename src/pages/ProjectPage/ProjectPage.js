import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import RouteTabs from '../../components/RouteTabs';
import HttpError from '../../components/HttpError';
import * as css from './ProjectPage.scss';
import ProjectTitle from './ProjectTitle';

import { getProjectInfo as getProject } from '../../actions/Project';

class ProjectPage extends Component {
  static propTypes = {
    children: PropTypes.object,
    getProjectInfo: PropTypes.func,
    params: PropTypes.object,
    project: PropTypes.object
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { getProjectInfo } = this.props;
    getProjectInfo(this.props.params.projectId);
  }

  render () {

    return (this.props.project.error) ? (<HttpError error={this.props.project.error}/>) : (
      <div id="project-page">
        <ProjectTitle
          portfolio={this.props.project.portfolio}
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
            to={`/projects/${this.props.params.projectId}/history`}
          >
            История
          </Link>
          <Link
            activeClassName="active"
            to={`/projects/${this.props.params.projectId}/metrics`}
          >
            Метрики по проекту
          </Link>
        </RouteTabs>

        <div className={css.tabContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project
});

const mapDispatchToProps = {
  getProjectInfo: getProject
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
