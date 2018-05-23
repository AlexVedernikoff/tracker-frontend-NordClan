import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProjectCard from './ProjectCard';
import * as css from './GitLabEditor.scss';

class ProjectList extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    projects: PropTypes.array
  };

  render() {
    const { projects } = this.props;
    return (
      <div className={css.projectList}>
        {projects.map(project => (
          <ProjectCard deleteProject={this.props.deleteProject} key={project.id} project={project} />
        ))}
      </div>
    );
  }
}

export default ProjectList;
