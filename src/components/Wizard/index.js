import Wizard from './Wizard';
import { connect } from 'react-redux';
import { jiraAuthorize, jiraCreateProject, getJiraProjects, getSimtrackUsersByName } from '../../actions/Jira';

const mapStateToProps = state => {
  return {
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
  jiraCreateProject,
  getJiraProjects,
  getSimtrackUsersByName
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
