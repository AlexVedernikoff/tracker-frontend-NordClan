import Wizard from './Wizard';
import { connect } from 'react-redux';
import {
  jiraAuthorize,
  jiraCreateProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation
} from '../../actions/Jira';

const mapStateToProps = state => {
  return {
    projects: state.Jira.projects,
    project: state.Jira.project,
    token: state.Jira.token,
    authorId: state.Auth.user.id,
    taskTypes: state.Dictionaries.taskTypes,
    taskStatuses: state.Dictionaries.taskStatuses,
    projectData: { name: state.Project.project.name, prefix: state.Project.project.prefix }
  };
};

const mapDispatchToProps = {
  jiraAuthorize,
  jiraCreateProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
