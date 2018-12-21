import Wizard from './Wizard';
import { connect } from 'react-redux';
import {
  jiraAuthorize,
  associateWithJiraProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation,
  getJiraIssueAndStatusTypes,
  getJiraProjectUsers
} from '../../actions/Jira';

const selectJiraProject = state => {
  return {
    id: state.Project.project.externalId,
    hostname: state.Project.project.jiraHostname,
    jiraProjectName: state.Project.project.jiraProjectName
  };
};

const mapStateToProps = state => {
  return {
    lang: state.Localize.lang,
    simtrackProjectId: state.Project.project.id,
    projects: state.Jira.projects,
    project: selectJiraProject(state),
    jiraData: state.Jira.project,
    token: state.Jira.token,
    authorId: state.Auth.user.id,
    taskTypes: state.Dictionaries.taskTypes,
    taskStatuses: state.Dictionaries.taskStatuses
  };
};

const mapDispatchToProps = {
  jiraAuthorize,
  associateWithJiraProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation,
  getJiraIssueAndStatusTypes,
  getJiraProjectUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
