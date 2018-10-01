import React from 'react';
import PropTypes from 'prop-types';
import { GITLAB_HOST } from '../../../constants/Settings';
import classnames from 'classnames';
import * as css from './TaskGitlabBranch.scss';
import { IconPlus } from '../../../components/Icons';
import { connect } from 'react-redux';
import localize from './TaskGitlabBranch.json';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import {
  getGitlabBranches,
  getGitlabBranchesByRepoId,
  createGitlabBranch,
  getProjectRepos
} from '../../../actions/Task';

class TaskGitlabBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModalGitlabBranch: false,
      repository: '',
      sourceBranch: '',
      branchName: ''
    };
  }

  componentDidMount() {
    this.props.getGitlabBranches(this.props.taskId);
    this.props.getProjectRepos(this.props.projectId);
  }

  handleOpenModalGitlabBranch = () => {
    this.setState({
      isOpenModalGitlabBranch: true
    });
  };

  handleCloseModalGitlabBranch = () => {
    this.setState({
      isOpenModalGitlabBranch: false,
      sourceBranch: null,
      repository: null,
      branchName: ''
    });
  };

  selectRepository = key => {
    return option => {
      this.props.getGitlabBranchesByRepoId(this.props.taskId, option.value);
      this.setState({
        [key]: option
      });
    };
  };

  selectBranch = key => {
    return option => {
      this.setState({
        [key]: option
      });
    };
  };

  selectBranchName = e => {
    this.setState({ branchName: e.target.value });
  };

  linkGitlabBranch = e => {
    const [group, repo] = e.project.split(' / ');
    window.open(`${GITLAB_HOST}/${group}/${repo}/tree/${e.branch}`);
  };

  createBranch = () => {
    this.props.createGitlabBranch(
      this.props.taskId,
      this.state.repository.value,
      this.state.sourceBranch.value,
      this.state.branchName
    );
    this.handleCloseModalGitlabBranch();
  };

  render() {
    const { lang, branches } = this.props;
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    let branchesInfo = [];

    if (branches && branches.length !== 0) {
      branchesInfo = branches.map(binfo => {
        return (
          <li key={`${binfo.branch}`} className={css.task} onClick={() => this.linkGitlabBranch(binfo)}>
            <div className={css.taskLabel}>
              <div className={css.taskLeftContent}>{`${binfo.project}`}</div>
              <div className={css.taskRightContent}>{`${binfo.branch}`}</div>
            </div>
          </li>
        );
      });
    }

    return (
      <div className={css.relatedTasks}>
        <h3>{localize[lang].GITLAB_BRANCHES}</h3>
        <ul className={css.taskList}>{branchesInfo}</ul>
        <a onClick={this.handleOpenModalGitlabBranch} className={classnames([css.task, css.add])}>
          <IconPlus style={iconStyles} />
          <div className={css.tooltip}>{localize[lang].CREATE_GITLAB_BRANCH}</div>
        </a>
        {this.state.isOpenModalGitlabBranch ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalGitlabBranch}>
            <div className={css.createGitlabProject}>
              <h3>{localize[lang].CREATE_GITLAB_BRANCH}</h3>
              <div className={css.modalContainer}>
                <SelectDropdown
                  name="repo"
                  placeholder={localize[lang].REPOSITORY}
                  multi={false}
                  value={this.state.repository}
                  onChange={this.selectRepository('repository')}
                  options={this.props.projectRepos}
                  autofocus
                />
                <SelectDropdown
                  name="sourcebranch"
                  placeholder={localize[lang].SOURCE_BRANCH}
                  multi={false}
                  value={this.state.sourceBranch}
                  onChange={this.selectBranch('sourceBranch')}
                  options={this.props.repoBranches}
                />
                <div>
                  <Input
                    placeholder={localize[lang].BRANCH_NAME}
                    value={this.state.branchName}
                    onChange={this.selectBranchName}
                  />
                </div>
                <Button
                  type="green"
                  text={localize[lang].CREATE_BRANCH}
                  onClick={this.createBranch}
                  disabled={!(this.state.repository && this.state.sourceBranch && this.state.branchName)}
                />
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}

TaskGitlabBranch.propTypes = {
  branches: PropTypes.array,
  createGitlabBranch: PropTypes.func,
  getGitlabBranches: PropTypes.func,
  getGitlabBranchesByRepoId: PropTypes.func,
  getProjectRepos: PropTypes.func,
  projectId: PropTypes.string,
  projectRepos: PropTypes.array,
  repoBranches: PropTypes.array,
  taskId: PropTypes.string
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  branches: state.Task.task.branches,
  repoBranches: state.Task.task.repoBranches,
  task: state.Task.task,
  projectRepos: state.Task.task.projectRepos
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
