import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import MissingProjectFieldsModal from '../../components/MissingProjectFieldsModal';
import { history } from '../../History';
import RouteTabs from '../../components/RouteTabs';
import HttpError from '../../components/HttpError';
import * as css from './ProjectPage.scss';
import ProjectTitle from './ProjectTitle';

import { getProjectInfo as getProject, changeProject } from '../../actions/Project';
import { ADMIN, EXTERNAL_USER } from '../../constants/Roles';
import { checkIsViewer } from '../../helpers/RoleValidator';
import localize from './projectPage.json';
import Title from 'react-title-component';
import { getLocalizedProjectTypes } from '../../selectors/dictionaries';

class ProjectPage extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    children: PropTypes.object,
    getProjectInfo: PropTypes.func,
    lang: PropTypes.string.isRequired,
    location: PropTypes.object,
    params: PropTypes.object,
    project: PropTypes.object,
    projectTypes: PropTypes.array,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getProjectInfo } = this.props;
    getProjectInfo(this.props.params.projectId);
  }

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles
      ? this.props.user.projectsRoles.admin.indexOf(this.props.project.id) !== -1 ||
          this.props.user.globalRole === ADMIN
      : false;
  };

  handleAnalyticsAction = event => {
    if (this.props.location.pathname.indexOf('analytics') !== -1) {
      event.preventDefault();
    }
  };

  handleTimesheetsAction = event => {
    if (this.props.location.pathname.indexOf('timesheets') !== -1) {
      event.preventDefault();
    }
  };
  handleCloseProjectPrefixModal = () => history.push('/projects');

  handleCloseProjectConfirmModal = values => {
    this.props.changeProject(
      {
        id: this.props.params.projectId,
        ...values
      },
      'Prefix'
    );
  };

  render() {
    const {
      projectTypes,
      lang,
      params: { projectId }
    } = this.props;
    const isProjectAdmin = this.checkIsAdminInProject();
    const tabs = [
      <Link key={`/projects/${projectId}`} activeClassName="active" onlyActiveOnIndex to={`/projects/${projectId}`}>
        {localize[lang].BOARD}
      </Link>,
      <Link activeClassName="active" key={`/projects/${projectId}/tasks`} to={`/projects/${projectId}/tasks`}>
        {localize[lang].TASK_LIST}
      </Link>,
      <Link activeClassName="active" key={`/projects/${projectId}/planning`} to={`/projects/${projectId}/planning`}>
        {localize[lang].PLANNING}
      </Link>,
      <Link activeClassName="active" key={`/projects/${projectId}/info`} to={`/projects/${projectId}/info`}>
        {localize[lang].INFO}
      </Link>,
      <Link activeClassName="active" key={`/projects/${projectId}/property`} to={`/projects/${projectId}/property`}>
        {localize[lang].SETTING}
      </Link>
    ];
    if (this.props.user.globalRole !== EXTERNAL_USER) {
      tabs.push(
        <Link activeClassName="active" key={`/projects/${projectId}/history`} to={`/projects/${projectId}/history`}>
          {localize[lang].HISTORY}
        </Link>
      );
    }

    if (isProjectAdmin || checkIsViewer(this.props.user.globalRole)) {
      tabs.push(
        <Link
          activeClassName="active"
          key={`/projects/${projectId}/analytics`}
          to={`/projects/${projectId}/analytics`}
          onClick={this.handleAnalyticsAction}
        >
          {localize[lang].ANALYTICS}
        </Link>
      );
    }
    if (isProjectAdmin) {
      tabs.push(
        <Link
          activeClassName="active"
          key={`/projects/${projectId}/timesheets`}
          to={`/projects/${projectId}/timesheets`}
          onClick={this.handleTimesheetsAction}
        >
          {localize[lang].TIME_REPORTS}
        </Link>
      );
    }

    return this.props.project.error ? (
      <HttpError error={this.props.project.error} />
    ) : (
      <div id="project-page">
        <Title render={`SimTrack - ${this.props.project.name || ''}`} />
        <ProjectTitle
          portfolio={this.props.project.portfolio}
          name={this.props.project.name || ''}
          prefix={this.props.project.prefix || ''}
          id={this.props.project.id || ''}
          isProjectAdmin={isProjectAdmin}
        />

        <RouteTabs pathname={this.props.location.pathname}>{tabs}</RouteTabs>

        <div className={css.tabContent}>{this.props.children}</div>
        {isProjectAdmin && this.props.project.prefix !== undefined && !this.props.project.prefix ? (
          <MissingProjectFieldsModal
            isOpen
            contentLabel="modal"
            text={localize[lang].ENTER_MISSING_DATA}
            error={this.props.project.validationError}
            projectTypes={projectTypes}
            onCancel={this.handleCloseProjectPrefixModal}
            onConfirm={this.handleCloseProjectConfirmModal}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  user: state.Auth.user,
  projectTypes: getLocalizedProjectTypes(state) || [],
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getProjectInfo: getProject,
  changeProject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPage);
