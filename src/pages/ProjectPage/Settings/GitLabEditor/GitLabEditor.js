import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, remove, difference } from 'lodash';

import * as css from './GitLabEditor.scss';
import { changeProject } from '../../../../actions/Project';
import ProjectList from './ProjectList';
import NewProject from './NewProject';
import Button from '../../../../components/Button';

class GitLabEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isAdding: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (get(newProps, 'project.gitlabProjectIds.length') !== get(this, 'props.project.gitlabProjectIds.length')) {
      this.setState({ isAdding: false });
    }
  }

  toggleCreating = () => {
    this.setState({ isAdding: !this.state.isAdding });
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
    const { isAdding } = this.state;
    const isProjects = get(project, 'gitlabProjects.length', false);

    return (
      <div className={css.gitLabEditor}>
        <h2>GitLab</h2>
        {isProjects ? <ProjectList deleteProject={this.deleteProject} projects={project.gitlabProjects} /> : null}
        {isAdding ? (
          <NewProject
            projectIds={project.gitlabProjectIds}
            onSubmit={this.saveProject}
            callback={this.toggleCreating}
          />
        ) : (
          <Button
            onClick={this.toggleCreating}
            addedClassNames={{ [css.addButton]: true }}
            type="primary"
            icon="IconPlus"
            text="Привязать репозиторий"
          />
        )}
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
