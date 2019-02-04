import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../../components/Modal/Modal';
import { connect } from 'react-redux';
import * as css from './JiraSynchronizeModal.scss';
import localize from './JiraSynchronizeModal.json';
import FinishForm from '../../../../../components/Wizard/steps/Finish/Finish';
import { selectJiraProject } from '../../../../../selectors/Project';
import { jiraAuthorize } from '../../../../../actions/Jira';

class JiraSynchronizeModal extends Component {
  static propTypes = {
    closeSynchronizeModal: PropTypes.func,
    lang: PropTypes.string,
    simtrackProjectId: PropTypes.number,
    synchronize: PropTypes.func,
    token: PropTypes.any
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { lang, token, closeSynchronizeModal, synchronize } = this.props;
    return (
      <div className={css.container}>
        <Modal isOpen onRequestClose={closeSynchronizeModal} contentLabel="Modal">
          <div className={css.stepsContainer}>{localize[lang].JIRA_SYNHRONIZE_CONFIRM}</div>
          <FinishForm lang={lang} token={token} nextStep={synchronize} synchronizeNow />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  jiraProject: selectJiraProject(state),
  simTrackProjectId: state.Project.project.id,
  jiraCaptachaLink: state.Jira.jiraCaptachaLink,
  isJiraAuthorizeError: state.Jira.isJiraAuthorizeError
});

const mapDispatchToProps = {
  jiraAuthorize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JiraSynchronizeModal);
