import TaskGitlabBranch from './TaskGitlabBranch';
import { connect } from 'react-redux';
import {
  getGitlabBranches,
  getGitlabBranchesByRepoId,
  createGitlabBranch,
  getProjectRepos
} from '../../../actions/Task';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  branches: state.Task.task.branches,
  repoBranches: state.Task.task.repoBranches,
  task: state.Task.task,
  projectRepos: state.Task.task.projectRepos,
  GITLAB_HOST: state.Task.task.GITLAB_HOSTNAME
});

const mapDispatchToProps = {
  getGitlabBranches,
  getProjectRepos,
  getGitlabBranchesByRepoId,
  createGitlabBranch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskGitlabBranch);
