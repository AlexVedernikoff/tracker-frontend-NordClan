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

class JiraEditor extends Component {
  static propTypes = {
    autoFillFiled: PropTypes.object,
    cleanJiraAssociation: PropTypes.func,
    createBatch: PropTypes.func,
    getJiraProject: PropTypes.func,
    jiraExternalId: PropTypes.string,
    jiraProject: PropTypes.object,
    jiraProjects: PropTypes.array,
    lang: PropTypes.string,
    openJiraWizard: PropTypes.func,
    simtrackProject: PropTypes.object,
    startSynchronize: PropTypes.bool,
    token: PropTypes.any
  };

  state = {
    startSynchronize: false
  };

  createBatch = (headers, pid) => {
    return this.props.createBatch(headers, pid).then(() => {
      this.onRequestClose();
    });
  };

  synchronizeWithJira = () => {
    this.createBatch({ 'x-jira-auth': this.props.token }, this.props.jiraExternalId).finally(() =>
      this.toggleConfirm()
    );
  };

  toggleConfirm = () => {
    this.setState({ startSynchronize: !this.state.startSynchronize });
  };

  render() {
    const { lang, simtrackProject, jiraExternalId } = this.props;
    const { startSynchronize } = this.state;
    return (
      <div className={css.jiraCard}>
        <h2>{localize[lang].SYNCHRONIZATION_WITH_JIRA}</h2>
        {!jiraExternalId ? (
          <Link to={`/projects/${simtrackProject.id}/jira-wizard`}>
            <Button text={localize[lang].ASSOCIATE_PROJECT_WITH_JIRA} type="primary" icon="IconPlus" />
          </Link>
        ) : (
          <Button
            onClick={this.toggleConfirm}
            text={localize[lang].SYNCHRONIZATION_WITH_JIRA}
            type="primary"
            icon="IconPlus"
          />
        )}
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
          <JiraSynchronizeModal closeSynchronizeModal={this.toggleConfirm} synchronize={this.synchronizeWithJira} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jiraExternalId: state.Project.project.externalId,
  jiraProjects: state.Jira.projects,
  simtrackProject: state.Project.project,
  token: state.Jira.token,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  cleanJiraAssociation,
  createBatch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraEditor);
