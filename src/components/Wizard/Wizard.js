import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { createStepsManager } from './wizardConfigurer';
import { states } from './states';

import Auth from './steps/auth/Auth';
import SelectProject from './steps/CreateProject/SelectJiraProject';
import SetAssociationForm from './steps/SetAssociation/SetAssociation';
import Finish from './steps/Finish/Finish';

const JIRA_WIZARD_STEPS = [states.AUTH, states.SELECT_JIRA_PROJECT, states.SET_ASSOCIATIONS, states.FINISH];

class Wizard extends Component {
  static propTypes = {
    associateWithJiraProject: PropTypes.func,
    authorId: PropTypes.number,
    createBatch: PropTypes.func,
    getJiraIssueAndStatusTypes: PropTypes.func,
    getJiraProjects: PropTypes.func,
    getProjectAssociation: PropTypes.func,
    getSimtrackUsersByName: PropTypes.func,
    isOpen: PropTypes.bool,
    jiraAuthorize: PropTypes.func,
    jiraData: PropTypes.object,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func,
    project: PropTypes.object,
    projectData: PropTypes.object,
    projects: PropTypes.array,
    setAssociation: PropTypes.func,
    simtrackProjectId: PropTypes.number,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.stepsManager = createStepsManager(JIRA_WIZARD_STEPS);
    this.state = {
      currentState: this.stepsManager.currentStep,
      temporaryStore: {
        authDataStep: {
          username: '',
          password: '',
          server: '',
          email: ''
        },
        selectJiraProjectStep: {
          simtrackProjectId: null,
          jiraProjectId: ''
        },
        token: null
      }
    };
  }

  onChange = (name, e) => {
    e.persist();
    this.setState(state => ({
      temporaryStore: {
        ...state.temporaryStore,
        authDataStep: { ...state.temporaryStore.authDataStep, [name]: e.target.value }
      }
    }));
  };

  // Auth forward function
  authNextStep = formData => {
    this.props.jiraAuthorize(formData).then(res => {
      const { token } = res;
      if (token) {
        this.setState({
          currentState: this.stepsManager[states.AUTH].forwardStep(),
          temporaryStore: {
            ...this.state.temporaryStore,
            token
          }
        });
      }
    });
  };

  // Create project forward function
  selectJiraProjectNext = formData => {
    const { jiraProjectId } = formData;
    this.setState({
      currentState: this.stepsManager[states.SELECT_JIRA_PROJECT].forwardStep(),
      temporaryStore: {
        ...this.state.temporaryStore,
        selectJiraProjectStep: {
          jiraProjectId
        }
      }
    });
  };

  // Create project backward function
  backward = step => {
    this.setState({
      currentState: step.backwardStep()
    });
  };

  // Set Association forward function
  setAssociation = (headers, formData) => {
    const projectId = this.props.project.id;
    const { issueTypesAssociation, statusesAssociation, userEmailAssociation } = formData;
    this.props
      .setAssociation(headers, projectId, issueTypesAssociation, statusesAssociation, userEmailAssociation)
      .then(res => {
        if (res) {
          this.setState({
            currentState: this.stepsManager[states.SET_ASSOCIATIONS].forwardStep()
          });
        }
      });
  };

  // Finish forward function
  synchronize = (headers, formData) => {
    const projectId = this.props.project.id;
    const { issueTypesAssociation, statusesAssociation, userEmailAssociation } = formData;
    this.props
      .setAssociation(headers, projectId, issueTypesAssociation, statusesAssociation, userEmailAssociation)
      .then(res => {
        if (res) {
          this.setState({
            currentState: this.stateMachine.getNextStep()
          });
        }
      });
  };

  onRequestClose = () => {
    this.setState({
      currentState: states.AUTH
    });
    this.props.onRequestClose();
  };

  createBatch = (headers, pid) => {
    this.props.createBatch(headers, pid).then(() => {
      this.onRequestClose();
    });
  };

  currentStep(lang) {
    const { authDataStep } = this.state.temporaryStore;
    const statuses = _.chain(this.props.taskStatuses)
      .filter(obj => !obj.name.includes('play'))
      .sortBy('id')
      .value();
    switch (this.state.currentState) {
      case states.AUTH:
        return (
          <div>
            <Auth lang={lang} nextStep={this.authNextStep} onChange={this.onChange} authData={authDataStep} />
          </div>
        );
      case states.SELECT_JIRA_PROJECT:
        return (
          <div>
            <SelectProject
              token={this.props.token}
              lang={lang}
              getJiraProjects={this.props.getJiraProjects}
              previousStep={() => this.backward(this.stepsManager[states.SELECT_JIRA_PROJECT])}
              nextStep={this.selectJiraProjectNext}
              jiraProjects={this.props.projects}
              authorId={this.props.authorId}
              authData={authDataStep}
            />
          </div>
        );
      case states.SET_ASSOCIATIONS:
        return (
          <div>
            <SetAssociationForm
              lang={lang}
              previousStep={() => this.backward(this.stepsManager[states.SET_ASSOCIATIONS])}
              nextStep={this.setAssociation}
              project={this.props.project}
              taskTypes={this.props.taskTypes}
              taskStatuses={statuses}
              token={this.props.token}
              getSimtrackUsers={this.props.getSimtrackUsersByName}
              getProjectAssociation={this.props.getProjectAssociation}
              getJiraIssueAndStatusTypes={this.props.getJiraIssueAndStatusTypes}
              jiraData={this.props.jiraData}
            />
          </div>
        );
      case states.FINISH:
        return (
          <div>
            <Finish
              lang={lang}
              token={this.props.token}
              previousStep={this.onRequestClose}
              nextStep={this.createBatch}
              project={this.props.project}
            />
          </div>
        );
      default:
        break;
    }
  }

  render() {
    const { lang, isOpen } = this.props;
    const {} = this.state;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={this.onRequestClose}>
          <div className={css.baseForm}>
            <div>{this.currentStep(lang)}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Wizard;
