import React, { Component } from 'react';
import ProjectCard from "../ProjectCard";

class Portfolio extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ marginBottom: 24 }}>

        <h2 style={{ marginBottom: 16 }}>
          {this.props.portfolio.name}
        </h2>

        {this.props.portfolio.data.map(project =>
          <ProjectCard key={project.id} isChild project={project} />
        )}

      </div>
    );
  }
}

export default Portfolio;
