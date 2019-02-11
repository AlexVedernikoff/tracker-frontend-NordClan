import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import localize from './JiraCard.json';
import * as css from './JiraCard.scss';
import { IconClose, IconJira } from '../../../../../components/Icons';
import { getJiraSyncInfo } from '../../../../../actions/Jira';
import moment from 'moment';
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal';

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

  toggleConfirm = () => {
    this.setState({ isConfirm: !this.state.isConfirm });
  };

  render() {
    const { isConfirm } = this.state;
    const { project, lang, simtrackProject, simtrackProjectId } = this.props;

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
        <div onClick={this.toggleConfirm} className={css.deleteProject}>
          <IconClose data-tip={localize[lang].CANSEL_CONNECT} />
        </div>
        {isConfirm ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={`${localize[lang].CONFIRM_CANSEL} ${project.name}?`}
            onCancel={this.toggleConfirm}
            onConfirm={() => this.props.deleteProject(simtrackProjectId)}
            onRequestClose={this.toggleConfirm}
          />
        ) : null}
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
