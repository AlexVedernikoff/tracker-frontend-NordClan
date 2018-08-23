import React, { Component } from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';

import ProjectCard from './ProjectCard';
import * as css from './GitLabEditor.scss';

class ProjectList extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    projects: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      newProjectIds: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.projects.length !== newProps.projects.length) {
      const oldProjectIds = this.props.projects.map(p => p.id);
      const newProjectIds = newProps.projects.map(p => p.id);
      const diff = difference(newProjectIds, oldProjectIds);
      this.setState({
        newProjectIds: diff
      });
    }
  }

  render() {
    const { projects } = this.props;
    const { newProjectIds } = this.state;

    return (
      <div className={css.projectList}>
        {projects
          .sort((a, b) => a.name_with_namespace > b.name_with_namespace)
          .map(
            project =>
              project ? (
                <ProjectCard
                  deleteProject={this.props.deleteProject}
                  key={project.id}
                  project={project}
                  isNew={newProjectIds.includes(project.id)}
                />
              ) : null
          )}
      </div>
    );
  }
}

export default ProjectList;
