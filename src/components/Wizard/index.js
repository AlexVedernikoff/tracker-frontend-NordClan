import Wizard from './Wizard';
import { connect } from 'react-redux';
import { jiraAuthorize, jiraCreateProject, getJiraProjects } from '../../actions/Jira';

const mapStateToProps = state => {
  return {
    projects: state.Jira.projects,
    token: state.Jira.token
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
