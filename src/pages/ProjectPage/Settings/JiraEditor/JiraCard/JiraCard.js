import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as css from './JiraCard.scss';
import { IconJira } from '../../../../../components/Icons';

class JiraCard extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    isNew: PropTypes.bool,
    lang: PropTypes.string,
    project: PropTypes.object,
    simtrackProjectId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirm: false
    };
  }

  render() {
    const { project } = this.props;

    return (
      <div className={css.projectCard}>
        <div className={css.jiraId}>Jira Id: {project.id}</div>
        <div className={css.projectName}>
          <span className={css.gitlabLogo}>
            <IconJira />{' '}
          </span>
          <a className="underline-link" href={project.hostname} title={project.name}>
            {project.name}
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(JiraCard);
