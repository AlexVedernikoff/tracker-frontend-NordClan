import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../../components/Modal/Modal';

import AuthForm from '../../../../../components/Wizard/steps/auth/Auth';
import { connect } from 'react-redux';
import Steps from '../../../../../components/Steps/Steps';
import { createStepsManager } from '../../../../../components/Wizard/wizardConfigurer';
import * as states from './states';
import * as css from './JiraSynchronizeModal.scss';
import localize from './JiraSynchronizeModal.json';
import FinishForm from '../../../../../components/Wizard/steps/Finish/Finish';

const JIRA_SYNHRONIZE_STEPS = [states.JIRA_SYNHRONIZE_AUTHORIZATION, states.JIRA_SYNHRONIZE_CONFIRM];

class JiraSynchronizeModal extends Component {
  static propTypes = {
    closeSynchronizeModal: PropTypes.func,
    isJiraAuthorizeError: PropTypes.bool,
    jiraCaptachaLink: PropTypes.any,
    lang: PropTypes.string,
    project: PropTypes.object,
    synchronize: PropTypes.func,
    token: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.stepsManager = createStepsManager(JIRA_SYNHRONIZE_STEPS);
  }

  state = {
    currentStep: !this.props.token ? states.JIRA_SYNHRONIZE_AUTHORIZATION : states.JIRA_SYNHRONIZE_CONFIRM,
    authDataState: {
      server: this.props.project.jiraHostName,
      username: '',
      password: ''
    }
  };

  onChange = (name, e) => {
    e.persist();
    this.setState(state => ({
      ...state,
      authDataState: { ...state.authDataState, [name]: e.target.value }
    }));
  };

  authNextStep = () => {
    this.setState({
      currentStep: this.stepsManager[states.JIRA_SYNHRONIZE_AUTHORIZATION].forwardStep()
    });
  };

  render() {
    const { lang, jiraCaptachaLink, isJiraAuthorizeError, token, closeSynchronizeModal, synchronize } = this.props;
    const steps = JIRA_SYNHRONIZE_STEPS.map((step, index) => ({
      stepNumber: index + 1,
      description: localize[lang][step]
    }));
    const { authDataState, currentStep } = this.state;
    return (
      <div className={css.container}>
        <Modal isOpen onRequestClose={closeSynchronizeModal} contentLabel="Modal">
          <div className={css.stepsContainer}>
            <Steps steps={steps} activeStepNumber={JIRA_SYNHRONIZE_STEPS.indexOf(currentStep) + 1} />
          </div>
          {currentStep === states.JIRA_SYNHRONIZE_AUTHORIZATION ? (
            <AuthForm
              lang={lang}
              nextStep={this.authNextStep}
              onChange={this.onChange}
              jiraCaptachaLink={jiraCaptachaLink}
              isJiraAuthorizeError={isJiraAuthorizeError}
              authData={authDataState}
              disabledFields={['server']}
              excludeFields={['email']}
            />
          ) : (
            <FinishForm lang={lang} token={token} previousStep={closeSynchronizeModal} nextStep={synchronize} />
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  project: state.Project.project,
  jiraCaptachaLink: state.Jira.jiraCaptachaLink,
  isJiraAuthorizeError: state.Jira.isJiraAuthorizeError,
  token: state.Jira.token
});

export default connect(mapStateToProps)(JiraSynchronizeModal);
