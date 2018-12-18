import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { states } from './States';
import StateMachine from './StateMachine';

import Auth from './steps/auth/Auth';
import SelectProject from './steps/CreateProject/SelectJiraProject';
import SetAssociationForm from './steps/SetAssociation/SetAssociation';
import Finish from './steps/Finish/Finish';

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
    this.state = {
      currentState: states.AUTH,
      authData: {
        username: '',
        password: '',
        server: '',
        email: ''
      }
    };
    this.stateMachine = new StateMachine();
  }

  onChange = (name, e) => {
    e.persist();
    this.setState(state => ({
      authData: { ...state.authData, [name]: e.target.value }
    }));
  };

  // Auth forward function
  authNext = formData => {
    this.props.jiraAuthorize(formData).then(res => {
      const { token } = res;
      if (token) {
        this.setState({
          currentState: this.stateMachine.forward(this.state.currentState)
        });
      }
    });
  };

  // Create project forward function
  selectJiraProjectNext = (headers, formData) => {
    this.props
      .associateWithJiraProject(headers, {
        ...formData,
        simtrackProjectId: this.props.simtrackProjectId
      })
      .then(res => {
        if (res) {
          this.setState({
            currentState: this.stateMachine.forward(this.state.currentState)
          });
        }
      });
  };

  // Create project backward function
  backward = () => {
    this.setState({
      currentState: this.stateMachine.backward(this.state.currentState)
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
            currentState: this.stateMachine.forward(this.state.currentState)
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
            currentState: this.stateMachine.forward(this.state.currentState)
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
    const statuses = _.chain(this.props.taskStatuses)
      .filter(obj => !obj.name.includes('play'))
      .sortBy('id')
      .value();
    switch (this.state.currentState) {
      case states.AUTH:
        return (
          <div>
            <Auth lang={lang} nextStep={this.authNext} onChange={this.onChange} authData={this.state.authData} />
          </div>
        );
      case states.SELECT_JIRA_PROJECT:
        return (
          <div>
            <SelectProject
              token={this.props.token}
              lang={lang}
              getJiraProjects={this.props.getJiraProjects}
              previousStep={this.backward}
              nextStep={this.selectJiraProjectNext}
              jiraProjects={this.props.projects}
              authorId={this.props.authorId}
              authData={this.state.authData}
            />
          </div>
        );
      case states.SET_ASSOCIATIONS:
        return (
          <div>
            <SetAssociationForm
              lang={lang}
              previousStep={this.backward}
              nextStep={this.setAssociation}
              project={this.props.project}
              taskTypes={this.props.taskTypes}
              taskStatuses={statuses}
              token={this.props.token}
              getSimtrackUsers={this.props.getSimtrackUsersByName}
              getProjectAssociation={this.props.getProjectAssociation}
              getJiraIssueAndStatusTypes={this.props.getJiraIssueAndStatusTypes}
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
