import Wizard from './Wizard';
import { connect } from 'react-redux';
import { jiraAuthorize, jiraCreateProject, getJiraProjects } from '../../actions/Jira';

const mapStateToProps = state => {
  return {
    projects: state.Jira.projects,
    project: state.Jira.project,
    token: state.Jira.token,
    authorId: state.Auth.user.id
  };
};

const mapDispatchToProps = {
  jiraAuthorize,
  jiraCreateProject,
  getJiraProjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
