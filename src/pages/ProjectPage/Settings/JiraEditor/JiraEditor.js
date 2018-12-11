import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './JiraEditor.scss';
import localize from './JiraEditor.json';
import Button from '../../../../components/Button';
import { connect } from 'react-redux';
import JiraCard from './JiraCard/JiraCard';
import { cleanJiraAssociation } from '../../../../actions/Jira';

class JiraEditor extends Component {
  static propTypes = {
    cleanJiraAssociation: PropTypes.func,
    getJiraProject: PropTypes.func,
    jiraExternalId: PropTypes.number,
    jiraProject: PropTypes.object,
    jiraProjects: PropTypes.array,
    lang: PropTypes.string,
    openJiraWizard: PropTypes.func,
    simtrackProject: PropTypes.object
  };

  render() {
    const { lang, openJiraWizard, simtrackProject, jiraExternalId } = this.props;
    return (
      <div className={css.jiraCard}>
        <h2>{localize[lang].SYNCHRONIZATION_WITH_JIRA}</h2>
        <Button
          onClick={openJiraWizard}
          text={localize[lang].ASSOCIATE_PROJECT_WITH_JIRA}
          type="primary"
          icon="IconPlus"
        />
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jiraExternalId: state.Project.project.externalId,
  jiraProjects: state.Jira.projects,
  simtrackProject: state.Project.project,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  cleanJiraAssociation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraEditor);
