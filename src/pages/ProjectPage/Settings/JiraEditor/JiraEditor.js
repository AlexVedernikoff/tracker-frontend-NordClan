import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './JiraEditor.scss';
import localize from './JiraEditor.json';
import Button from '../../../../components/Button';
import { connect } from 'react-redux';
import JiraCard from './JiraCard/JiraCard';
import { getJiraProject } from '../../../../actions/Jira';

class JiraEditor extends Component {
  static propTypes = {
    getJiraProject: PropTypes.func,
    jiraProject: PropTypes.object,
    jiraProjects: PropTypes.array,
    lang: PropTypes.string,
    openJiraWizard: PropTypes.func,
    simtrackProject: PropTypes.object
  };

  getJiraProjectName = () => {
    const project = this.props.jiraProjects.find(p => p.id === this.props.jiraProject.id);
    return project ? project.name : '';
  };

  componentDidMount() {
    if (this.props.jiraProject) {
      this.props.getJiraProject(this.props.simtrackProject.id);
    }
  }

  render() {
    const { lang, openJiraWizard } = this.props;
    const projectName = this.getJiraProjectName();
    console.log(projectName);
    const { jiraProject } = this.props;
    return (
      <div className={css.jiraCard}>
        <h2>{localize[lang].SYNCHRONIZATION_WITH_JIRA}</h2>
        <Button
          onClick={openJiraWizard}
          text={localize[lang].ASSOCIATE_PROJECT_WITH_JIRA}
          type="primary"
          icon="IconPlus"
        />
        {this.props.jiraProject.id ? (
          <JiraCard
            project={{
              id: jiraProject.id,
              name: projectName,
              hostname: this.props.jiraProject.jiraHostName
            }}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jiraProject: state.Jira.project,
  jiraProjects: state.Jira.projects,
  simtrackProject: state.Project.project,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getJiraProject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraEditor);
