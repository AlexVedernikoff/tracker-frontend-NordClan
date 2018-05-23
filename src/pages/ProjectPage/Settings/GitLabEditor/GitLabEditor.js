import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, remove } from 'lodash';

import * as css from './GitLabEditor.scss';
import { changeProject } from '../../../../actions/Project';
import ProjectList from './ProjectList';
import NewProject from './NewProject';

class GitLabEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object
  };

  saveProject = value => {
    const isProjectIds = get(this.props.project, 'gitlabProjectIds', false);
    this.props.changeProject({
      gitlabProjectIds: isProjectIds ? [...this.props.project.gitlabProjectIds, +value] : [+value],
      id: this.props.project.id
    });
  };

  deleteProject = value => {
    const idsWithoutRemoved = [...get(this.props.project, 'gitlabProjectIds', [])];
    remove(idsWithoutRemoved, id => id === value);

    this.props.changeProject({
      gitlabProjectIds: idsWithoutRemoved,
      id: this.props.project.id
    });
  };

  render() {
    const { project } = this.props;
    const isProjects = get(project, 'gitlabProjects.length', false);

    return (
      <div className={css.gitLabEditor}>
        <h2>GitLab</h2>
        {isProjects ? <ProjectList deleteProject={this.deleteProject} projects={project.gitlabProjects} /> : null}
        <NewProject projectIds={project.gitlabProjectIds} onSubmit={this.saveProject} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.Project.project
  };
}

const mapDispatchToProps = {
  changeProject
};

export default connect(mapStateToProps, mapDispatchToProps)(GitLabEditor);
