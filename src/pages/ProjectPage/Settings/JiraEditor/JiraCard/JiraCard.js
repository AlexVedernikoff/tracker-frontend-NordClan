import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import localize from './JiraCard.json';
import * as css from './JiraCard.scss';
import { IconJira } from '../../../../../components/Icons';
import { getJiraSyncInfo } from '../../../../../actions/Jira';
import moment from 'moment';

class JiraCard extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    getJiraSyncInfo: PropTypes.func,
    isNew: PropTypes.bool,
    isSync: PropTypes.bool,
    lang: PropTypes.string,
    project: PropTypes.object,
    simtrackProject: PropTypes.object,
    simtrackProjectId: PropTypes.number,
    syncDatesArray: PropTypes.array,
    syncSuccess: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirm: false
    };
  }

  componentDidMount() {
    this.props.getJiraSyncInfo(this.props.simtrackProject.id);
  }

  render() {
    const { project, lang, simtrackProject } = this.props;

    const classNameForSync = cn(css.syncStatus, {
      [css.failedStatus]: simtrackProject.status === 'FAILED',
      [css.successStatus]: simtrackProject.status === 'SUCCESS'
    });

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
          {simtrackProject.status ? (
            <div className={css.syncInfo}>
              {simtrackProject.status === 'SUCCESS' ? (
                <div className={classNameForSync}>{localize[lang].SUCCESS}</div>
              ) : (
                <div className={classNameForSync}>{localize[lang].SYNC_FAILED}</div>
              )}
              <div className={classNameForSync}>
                {localize[lang].LAST_SYNC}: {moment(simtrackProject.lastSyncDate).format('DD.MM.YYYY')}
              </div>
            </div>
          ) : (
            <div className={css.statusNotSync}>{localize[lang].NOT_SYNC}</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  simtrackProject: state.Project.project
});

const mapDispatchToProps = {
  getJiraSyncInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraCard);
