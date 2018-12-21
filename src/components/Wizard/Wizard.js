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
import { associationStates } from './steps/SetAssociation/AssociationStates';
import { associateWithJiraProject } from '../../actions/Jira';

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

        selectedSimtrackCol: null,
        selectedJiraCols: [],

        jiraIssueTypes: [],
        jiraStatusTypes: []
      },
      token: null
    };
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
    this.props.jiraAuthorize(formData).then(res => {
      const { token } = res;
      if (token) {
        this.setState({
          currentStep: this.stepsManager[states.AUTH].forwardStep(),
          token
        });
      }
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

  setAssociationState = (association, jiraAssociations) => {
    this.setState(
      {
        associationState: {
          ...this.state.associationState,
          issueTypesAssociation: association.issueTypesAssociation,
          statusesAssociation: association.statusesAssociation,
          userEmailAssociation: association.userEmailAssociation,
          jiraIssueTypes: jiraAssociations.issueTypes,
          jiraStatusTypes: jiraAssociations.statusTypes,
          jiraUsers: jiraAssociations.users
        }
      },
      () => this.setAssociationStateDefault()
    );
  };

  setAssociationStateDefault = () => {
    const {
      currentState,
      issueTypesAssociation,
      statusesAssociation,
      userEmailAssociation
    } = this.state.associationState;
    let associatedArr;
    let value;
    switch (currentState) {
      case associationStates.USERS:
        value = this.state.userEmailAssociation[0];
        associatedArr = userEmailAssociation.filter(e => (value.internalUserId || value.id) === e.internalUserId);
        const users = userEmailAssociation.map(user => ({ fullNameRu: user.fullNameRu, id: user.internalUserId }));
        if (this.state.userEmailAssociation.length) {
          this.setState({ users });
        }
        value = users[0];
        break;

      case associationStates.ISSUE_TYPES:
        value = this.props.taskTypes.find(el => el.id === 1);
        associatedArr = issueTypesAssociation.filter(e => value.id === e.internalTaskTypeId);
        break;

      case associationStates.STATUS_TYPES:
        value = this.props.taskStatuses.find(el => el.id === 1);
        associatedArr = statusesAssociation.filter(e => value.id === e.internalStatusId);
        break;
      default:
        break;
    }

    this.setState({
      associationState: {
        ...this.state.associationState,
        selectedJiraCols: [...associatedArr],
        selectedSimtrackCol: value
      }
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
      currentStep: states.AUTH
    });
    this.props.onRequestClose();
  };

  createBatch = (headers, pid) => {
    this.props.createBatch(headers, pid).then(() => {
      this.onRequestClose();
    });
  };

  currentStep(lang) {
    const { authDataState, selectJiraProjectState } = this.state;
    const { simtrackProjectId } = this.props;
    const statuses = _.chain(this.props.taskStatuses)
      .filter(obj => !obj.name.includes('play'))
      .sortBy('id')
      .value();
    switch (this.state.currentStep) {
      case states.AUTH:
        return (
          <div>
            <Auth lang={lang} nextStep={this.authNextStep} onChange={this.onChange} authData={authDataState} />
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
              nextStep={this.createBatch}
              project={this.props.project}
              jiraHostName={authDataState.server}
              simtrackProjectId={simtrackProjectId}
              jiraProjectId={selectJiraProjectState.jiraProjectId}
              associationState={this.state.associationState}
              associateWithJiraProject={this.props.associateWithJiraProject}
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
