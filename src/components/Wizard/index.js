import Wizard from './Wizard';
import { connect } from 'react-redux';
import {
  jiraAuthorize,
  associateWithJiraProject,
  getJiraProjects,
  getSimtrackUsersByName,
  setAssociation,
  createBatch,
  getProjectAssociation
} from '../../actions/Jira';

const mapStateToProps = state => {
  return {
    simtrackProjectId: state.Project.project.id,
    projects: state.Jira.projects,
    project: state.Jira.project,
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
  getProjectAssociation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
