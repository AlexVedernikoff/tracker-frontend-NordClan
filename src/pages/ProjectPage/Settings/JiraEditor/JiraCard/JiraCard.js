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
import * as syncStatuses from './syncStatus';

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

  getStatusInfo = status => {
    const { lang, simtrackProject } = this.props;
    const dateWithTimeZone = moment.utc(simtrackProject.lastSyncDate).local();

    const classNameForSync = cn(css.syncStatus, {
      [css.successStatus]: status === syncStatuses.SUCCESS,
      [css.failedStatus]: status === syncStatuses.FAILED
    });

    const statusBlock = statusText => <div className={classNameForSync}>{statusText}</div>;

    const lastDateSyncBlock = (clazz, date) => (
      <div className={clazz}>
        {localize[lang].LAST_SYNC}: {moment(date).format('DD.MM.YYYY')}
      </div>
    );

    switch (status) {
      case syncStatuses.SUCCESS:
        return (
          <div>
            {statusBlock(localize[lang].SUCCESS)}
            {lastDateSyncBlock(classNameForSync, dateWithTimeZone)}
          </div>
        );
      case syncStatuses.FAILED:
        return (
          <div>
            {statusBlock(localize[lang].SYNC_FAILED)}
            {lastDateSyncBlock(classNameForSync, dateWithTimeZone)}
          </div>
        );
      case syncStatuses.RUNNING:
        return (
          <div>
            {statusBlock(localize[lang].SYNC_RUNNING)}
            <div className={classNameForSync}>
              {localize[lang].LAST_DATE_RUNNING}: {moment(dateWithTimeZone).format('DD.MM.YYYY')}
            </div>
          </div>
        );
      case syncStatuses.CANCELED:
        return (
          <div>
            {statusBlock(localize[lang].SYNC_CANCELED)}
            <div className={classNameForSync}>
              {localize[lang].LAST_DATE_RUNNING}: {moment(dateWithTimeZone).format('DD.MM.YYYY')}
            </div>
          </div>
        );
      case syncStatuses.PENDING:
        return (
          <div>
            {statusBlock(localize[lang].SYNC_PENDING)}
            <div className={classNameForSync}>
              {localize[lang].LAST_DATE_RUNNING}: {moment(dateWithTimeZone).format('DD.MM.YYYY')}
            </div>
          </div>
        );
      default:
        return <div>{statusBlock(localize[lang].NOT_SYNC)}</div>;
    }
  };

  render() {
    const { isConfirm } = this.state;
    const { project, lang, simtrackProject, simtrackProjectId } = this.props;

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
          <div className={css.syncStatus}>{this.getStatusInfo(simtrackProject.status)}</div>
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
