import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import localize from './JiraCard.json';
import * as css from './JiraCard.scss';
import { IconCheck, IconClose, IconJira } from '../../../../../components/Icons';

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
    const { project, syncSuccess = false, lang } = this.props;

    return (
      <div className={css.projectCard}>
        <div className={css.cardContentContainer}>
          <div className={css.jiraInfo}>
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
          <div className={css.syncInfo}>
            {syncSuccess ? <div>{localize[lang].success}</div> : <div>{localize[lang].failed}</div>}
            <div>
              {$localize[lang].lastSync}: {}
            </div>
          </div>
          <div>
            <div
              className={cn(css.circleContainer, {
                [css.failedIcon]: !syncSuccess
              })}
            >
              {syncSuccess ? <IconCheck /> : <IconClose />}
            </div>
          </div>
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
