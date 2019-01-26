import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createStepsManager } from './wizardConfigurer';
import { states } from './states';

import Auth from './steps/auth/Auth';
import SelectProject from './steps/CreateProject/SelectJiraProject';
import SetAssociationForm from './steps/SetAssociation/SetAssociation';
import Finish from './steps/Finish/Finish';
import { associationStates } from './steps/SetAssociation/AssociationStates';
import WizardHeader from './WizardHeader';
import { history } from '../../History';
import localize from './localization';

const JIRA_WIZARD_STEPS = [states.AUTH, states.SELECT_JIRA_PROJECT, states.SET_ASSOCIATIONS, states.FINISH];

class Wizard extends Component {
  static propTypes = {
    associateWithJiraProject: PropTypes.func,
    authorId: PropTypes.number,
    createBatch: PropTypes.func,
    getJiraIssueAndStatusTypes: PropTypes.func,
    getJiraProjectUsers: PropTypes.func,
    getJiraProjects: PropTypes.func,
    getProjectAssociation: PropTypes.func,
    getProjectInfo: PropTypes.func,
    getSimtrackUsersByName: PropTypes.func,
    isJiraAuthorizeError: PropTypes.any,
    jiraAuthorize: PropTypes.func,
    jiraCaptachaLink: PropTypes.any,
    jiraData: PropTypes.object,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func,
    params: PropTypes.object,
    project: PropTypes.object,
    projectData: PropTypes.object,
    projects: PropTypes.array,
    setAssociation: PropTypes.func,
    simtrackProjectName: PropTypes.string,
    simtrackProjectUsers: PropTypes.array,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.stepsManager = createStepsManager(JIRA_WIZARD_STEPS);
    this.state = {
      currentStep: this.stepsManager.currentStep,
      authDataState: {
        username: '',
        password: '',
        server: '',
        email: ''
      },

      selectJiraProjectState: {
        jiraProjectId: null
      },

      associationState: {
        users: [],
        jiraUsers: [],

        issueTypesAssociation: [],
        statusesAssociation: [],
        userEmailAssociation: [],

        selectedJiraCol: null,

        jiraIssueTypes: [],
        jiraStatusTypes: []
      },
      token: null
    };
  }

  componentDidMount() {
    if (!this.props.simtrackProjectUsers.length) {
      this.props.getProjectInfo(this.props.params.projectId);
    }
  }

  onChange = (name, e) => {
    e.persist();
    this.setState(state => ({
      ...state,
      authDataState: { ...state.authDataState, [name]: e.target.value }
    }));
  };

  // Auth forward function
  authNextStep = formData => {
    this.props
      .jiraAuthorize(formData)
      .then(res => {
        const { token } = res;
        if (token) {
          this.setState({
            currentStep: this.stepsManager[states.AUTH].forwardStep(),
            token
          });
        }
      })
      .catch(() => {
        this.setState(state => ({
          authData: {
            ...state.authData,
            username: ''
          }
        }));
      });
  };

  // Create project forward function
  selectJiraProjectNext = formData => {
    const { jiraProjectId } = formData;
    this.setState({
      currentStep: this.stepsManager[states.SELECT_JIRA_PROJECT].forwardStep(),
      selectJiraProjectState: {
        jiraProjectId
      }
    });
  };

  // Create project backward function
  backward = step => {
    this.setState({
      currentStep: step.backwardStep()
    });
  };

  // Set Association forward function
  setAssociation = () => {
    this.setState({
      currentStep: this.stepsManager[states.SET_ASSOCIATIONS].forwardStep()
    });
  };

  setAssociationState = (association, jiraAssociations, step) => {
    this.setState(
      {
        associationState: {
          ...this.state.associationState,
          jiraIssueTypes: jiraAssociations.issueTypes,
          jiraStatusTypes: jiraAssociations.statusTypes,
          jiraUsers: jiraAssociations.users
        }
      },
      () => {
        this.setAssociationStateDefault(step);
      }
    );
  };

  getJiraDataSource = (associationState, step) => {
    const { jiraIssueTypes, jiraStatusTypes, jiraUsers } = associationState;
    let dataSource;

    switch (step) {
      case associationStates.ISSUE_TYPES:
        dataSource = jiraIssueTypes;
        break;
      case associationStates.STATUS_TYPES:
        dataSource = jiraStatusTypes;
        break;
      case associationStates.USERS:
        dataSource = jiraUsers;
        break;
      default:
        dataSource = [];
        break;
    }

    return dataSource;
  };

  setAssociationStateDefault = step => {
    this.setState(state => {
      const jiraDataSource = this.getJiraDataSource(state.associationState, step);
      const value = jiraDataSource.length ? jiraDataSource[0] : null;

      return {
        associationState: {
          ...state.associationState,
          selectedJiraCol: value
        }
      };
    });
  };

  mergeAssociationState = (mergeData, callback) => {
    this.setState(
      {
        associationState: {
          ...this.state.associationState,
          ...mergeData
        }
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  // Finish forward function
  /*synchronize = (headers, formData) => {
    const projectId = this.props.project.id;
    const { issueTypesAssociation, statusesAssociation, userEmailAssociation } = formData;
    this.props
      .setAssociation(headers, projectId, issueTypesAssociation, statusesAssociation, userEmailAssociation)
      .then(res => {
        if (res) {
          this.setState({
            currentStep: this.stateMachine.getNextStep()
          });
        }
      });
  };*/

  onRequestClose = () => {
    this.setState({
      currentStep: states.CLOSED
    });
  };

  associateWithJira = () => {
    const { server } = this.state.authDataState;
    const { issueTypesAssociation, statusesAssociation, userEmailAssociation } = this.state.associationState;
    this.props
      .associateWithJiraProject(this.props.token, {
        jiraHostName: server,
        simtrackProjectId: this.props.params.projectId,
        jiraProjectId: this.state.selectJiraProjectState.jiraProjectId,
        issueTypesAssociation,
        statusesAssociation,
        userEmailAssociation
      })
      .then(() => this.onRequestClose())
      .catch(() => this.onRequestClose());
  };

  createBatch = (headers, pid) => {
    this.props.createBatch(headers, pid).then(() => {
      this.onRequestClose();
    });
  };

  getStepsUI = () => {
    return <WizardHeader lang={this.props.lang} activeStep={this.state.currentStep} jiraSteps={JIRA_WIZARD_STEPS} />;
  };

  currentStep(lang) {
    const { authDataState, selectJiraProjectState } = this.state;
    const simtrackProjectId = this.props.params.projectId;
    const statuses = _.chain(this.props.taskStatuses)
      .filter(obj => !obj.name.includes('play'))
      .sortBy('id')
      .value();
    const { jiraCaptachaLink, isJiraAuthorizeError } = this.props;
    switch (this.state.currentStep) {
      case states.AUTH:
        return (
          <div>
            <Auth
              lang={lang}
              nextStep={this.authNextStep}
              onChange={this.onChange}
              jiraCaptachaLink={jiraCaptachaLink}
              isJiraAuthorizeError={isJiraAuthorizeError}
              authData={authDataState}
            />
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
              authData={authDataState}
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
              simtrackProjectId={simtrackProjectId}
              jiraProjectId={selectJiraProjectState.jiraProjectId}
              setAssociation={this.setAssociationState}
              setDefault={this.setAssociationStateDefault}
              associationState={this.state.associationState}
              mergeAssociationState={this.mergeAssociationState}
              getJiraProjectUsers={this.props.getJiraProjectUsers}
              simtrackProjectUsers={this.props.simtrackProjectUsers}
            />
          </div>
        );
      case states.FINISH:
        return (
          <div>
            <Finish
              lang={lang}
              token={this.state.token}
              previousStep={this.onRequestClose}
              nextStep={this.associateWithJira}
            />
          </div>
        );
      case states.CLOSED:
        history.push(`/projects/${simtrackProjectId}/property`);
        break;
      default:
        break;
    }
  }

  render() {
    const { lang, simtrackProjectName } = this.props;

    return (
      <div>
        <h1>{localize[lang].SYNC_WITH_JIRA(simtrackProjectName)}</h1>
        <hr />
        <div>{this.getStepsUI()}</div>
        {this.currentStep(lang)}
      </div>
    );
  }
}

export default Wizard;
