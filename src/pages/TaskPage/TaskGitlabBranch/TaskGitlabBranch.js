import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import * as css from './TaskGitlabBranch.scss';
import { IconPlus } from '../../../components/Icons';
import { connect } from 'react-redux';
import localize from './TaskGitlabBranch.json';

import { getGitlabBranches } from '../../../actions/Task';

class TaskGitlabBranch extends React.Component {
  componentDidMount() {
    this.props.getGitlabBranches(this.props.taskId);
  }

  render() {
    const { lang, branches } = this.props;
    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };
    if (!branches) {
      return null;
    }

    let branchesInfo = [];
    branches.map(binfo => {
      const repoBranches = binfo.branches.map(b => {
        return Object.assign(b, { repository: binfo.project });
      });
      branchesInfo = [...repoBranches];
    });

    branchesInfo = branchesInfo.map(binfo => {
      return (
        <li key={`${binfo.name}`} className={css.task}>
          <div className={css.taskLabel}>
            <div className={css.taskLeftContent}>{`${binfo.repository.name_with_namespace}`}</div>
            <div className={css.taskRightContent}>{`${binfo.name}`}</div>
          </div>
        </li>
      );
    });

    // ЭТО ЛИСТ ГИТЛАБ БРАНЧЕЙ
    /*
    const branches = this.props.task[this.props.branches].map(task => {
      return (
        <li key={`${this.props.type}-${task.id}`} className={this.taskStyle(task.statusId)}>
          <span className={css.taskLabel}>
            <div>
              <div>{`${this.props.task.project.prefix}-${task.id}`}</div>
              <div className={css.taskStatus}>{getStatusNameById(task.statusId)}</div>
            </div>
            <div className={css.taskStatusIcon}>
              {isTaskInProgress(task.statusId) ? <IconPlay /> : isTaskInHold(task.statusId) ? <IconPause /> : null}
            </div>
          </span>
          <div className={css.taskLink}>
            <Link className="underline-link" to={`/projects/${this.props.task.project.id}/tasks/${task.id}`}>
              {task.name}
            </Link>
          </div>
          {this.props.onDelete ? this.getActionIcon(task) : null}
        </li>
      );
    });
    */

    return (
      <div className={css.relatedTasks}>
        <h3>{localize[lang].GITLAB_BRANCHES}</h3>
        <ul className={css.taskList}>{branchesInfo}</ul>
        <a className={css.add}>
          <IconPlus style={iconStyles} />
          <div className={css.tooltip}>{localize[lang].ADD_SUBTASKS}</div>
        </a>
      </div>
    );
  }
}

TaskGitlabBranch.propTypes = {
  branches: PropTypes.array,
  getGitlabBranches: PropTypes.func,
  taskId: PropTypes.string
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  branches: state.Task.task.branches,
  task: state.Task.task
});

const mapDispatchToProps = {
  getGitlabBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskGitlabBranch);
