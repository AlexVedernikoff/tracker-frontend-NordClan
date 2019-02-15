import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as css from './JiraEditor.scss';
import localize from './JiraEditor.json';
import Button from '../../../../components/Button';
import { connect } from 'react-redux';
import JiraCard from './JiraCard/JiraCard';
import { cleanJiraAssociation, createBatch } from '../../../../actions/Jira';
import JiraSynchronizeModal from './jiraSynchronizeModal';
import { checkIsAdminInProject } from '../../../../utils/isAdmin';

class JiraEditor extends Component {
  static propTypes = {
    autoFillFiled: PropTypes.object,
    cleanJiraAssociation: PropTypes.func,
    createBatch: PropTypes.func,
    getJiraProject: PropTypes.func,
    jiraExternalId: PropTypes.string,
    jiraProject: PropTypes.object,
    jiraProjects: PropTypes.array,
    jiraToken: PropTypes.any,
    lang: PropTypes.string,
    openJiraWizard: PropTypes.func,
    simtrackProject: PropTypes.object,
    startSynchronize: PropTypes.bool,
    user: PropTypes.object
  };

  state = {
    startSynchronize: false
  };

  createBatch = (headers, pid) => {
    return this.props.createBatch(headers, pid);
  };

  synchronizeWithJira = () => {
    this.createBatch({ 'x-jira-auth': this.props.jiraToken }, this.props.jiraExternalId).finally(() =>
      this.toggleConfirm()
    );
  };

  toggleConfirm = () => {
    this.setState({ startSynchronize: !this.state.startSynchronize });
  };

  userCanSynchronize = () => {
    return (
      checkIsAdminInProject(this.props.user, this.props.simtrackProject.id) ||
      this.props.user.usersProjects.some(
        project =>
          project.roles.some(role => role.projectRoleId === 1 || role.projectRoleId === 2) &&
          project.projectId === project.id
      )
    );
  };

  render() {
    const { lang, simtrackProject, jiraExternalId, jiraToken } = this.props;
    const { startSynchronize } = this.state;
    return (
      <div className={css.jiraCard}>
        <h2>{localize[lang].SYNCHRONIZATION_WITH_JIRA}</h2>
        {!jiraExternalId && this.userCanSynchronize() ? (
          <Link to={`/projects/${simtrackProject.id}/jira-wizard`}>
            <Button text={localize[lang].ASSOCIATE_PROJECT_WITH_JIRA} type="primary" icon="IconPlus" />
          </Link>
        ) : this.userCanSynchronize() ? (
          <Button
            onClick={this.toggleConfirm}
            text={localize[lang].SYNCHRONIZATION_WITH_JIRA}
            type="primary"
            icon="IconPlus"
          />
        ) : null}
        {jiraExternalId ? (
          <JiraCard
            simtrackProjectId={simtrackProject.id}
            deleteProject={this.props.cleanJiraAssociation}
            project={{
              id: jiraExternalId,
              name: simtrackProject.jiraProjectName,
              hostname: simtrackProject.jiraHostName
            }}
          />
        ) : null}
        {startSynchronize ? (
          <JiraSynchronizeModal
            closeSynchronizeModal={this.toggleConfirm}
            synchronize={this.synchronizeWithJira}
            token={jiraToken}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jiraExternalId: state.Project.project.externalId,
  jiraToken: state.Project.project.jiraToken,
  jiraProjects: state.Jira.projects,
  simtrackProject: state.Project.project,
  token: state.Jira.token,
  lang: state.Localize.lang,
  user: state.Auth.user
});

const mapDispatchToProps = {
  cleanJiraAssociation,
  createBatch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraEditor);
