import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as css from './JiraCard.scss';
import localize from './JiraCard.json';
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal';
import { IconClose, IconJira } from '../../../../../components/Icons';

class JiraCard extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    isNew: PropTypes.bool,
    lang: PropTypes.string,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirm: false
    };
  }

  deleteProject = () => {
    this.toggleConfirm();
  };

  toggleConfirm = () => {
    this.setState({ isConfirm: !this.state.isConfirm });
  };

  render() {
    const { project, lang } = this.props;
    const { isConfirm } = this.state;

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
        <div onClick={this.toggleConfirm} className={css.deleteProject}>
          <IconClose data-tip={localize[lang].CANSEL_CONNECT} />
        </div>
        {isConfirm ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={`${localize[lang].CONFIRM_CANSEL} ${project.name}?`}
            onCancel={this.toggleConfirm}
            onConfirm={() => this.props.deleteProject(project.simtrackProjectId)}
            onRequestClose={this.toggleConfirm}
          />
        ) : null}
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
