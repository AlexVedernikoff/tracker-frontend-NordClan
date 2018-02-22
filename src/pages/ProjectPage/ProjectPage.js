import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import RouteTabs from '../../components/RouteTabs';
import HttpError from '../../components/HttpError';
import * as css from './ProjectPage.scss';
import ProjectTitle from './ProjectTitle';

import { getProjectInfo as getProject } from '../../actions/Project';
import { ADMIN } from '../../constants/Roles';

class ProjectPage extends Component {
  static propTypes = {
    children: PropTypes.object,
    getProjectInfo: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
    project: PropTypes.object,
    user: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { getProjectInfo } = this.props;
    getProjectInfo(this.props.params.projectId);
  }

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles
      ? this.props.user.projectsRoles.admin.indexOf(this.props.project.id) !== -1
        || this.props.user.globalRole === ADMIN
      : false;
  };

  handleAnalyticsAction = (event) => {
    if (this.props.location.pathname.indexOf('analytics') !== -1) {
      event.preventDefault();
    }
  }

  render () {
    const isProjectAdmin = this.checkIsAdminInProject();
    const tabs = [
      <Link
        key={`/projects/${this.props.params.projectId}`}
        activeClassName="active"
        onlyActiveOnIndex
        to={`/projects/${this.props.params.projectId}`}
      >
        Доска
      </Link>,
      <Link
        activeClassName="active"
        key={`/projects/${this.props.params.projectId}/tasks`}
        to={`/projects/${this.props.params.projectId}/tasks`}
      >
        Список задач
      </Link>,
      <Link
        activeClassName="active"
        key={`/projects/${this.props.params.projectId}/planning`}
        to={`/projects/${this.props.params.projectId}/planning`}
      >
        Планирование
      </Link>,
      <Link
        activeClassName="active"
        key={`/projects/${this.props.params.projectId}/info`}
        to={`/projects/${this.props.params.projectId}/info`}
      >
        Информация
      </Link>,
      <Link
        activeClassName="active"
        key={`/projects/${this.props.params.projectId}/property`}
        to={`/projects/${this.props.params.projectId}/property`}
      >
        Настройки
      </Link>,
      <Link
        activeClassName="active"
        key={`/projects/${this.props.params.projectId}/history`}
        to={`/projects/${this.props.params.projectId}/history`}
      >
        История
      </Link>
    ];

    if (isProjectAdmin) {
      tabs.push(
        <Link
          activeClassName="active"
          key={`/projects/${this.props.params.projectId}/analytics`}
          to={`/projects/${this.props.params.projectId}/analytics`}
          onClick={this.handleAnalyticsAction}
        >
          Аналитика
        </Link>
      );
    }

    return (this.props.project.error) ? (<HttpError error={this.props.project.error}/>) : (
      <div id="project-page">
        <ProjectTitle
          portfolio={this.props.project.portfolio}
          name={this.props.project.name || ''}
          prefix={this.props.project.prefix || ''}
          id={this.props.project.id || ''}
          isProjectAdmin={isProjectAdmin}
        />

        <RouteTabs>
          {tabs}
        </RouteTabs>

        <div className={css.tabContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  user: state.Auth.user
});

const mapDispatchToProps = {
  getProjectInfo: getProject
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
