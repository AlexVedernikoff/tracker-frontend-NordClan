import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { states } from './States';
import StateMachine from './StateMachine';

import Auth from './steps/auth/Auth';
import SetAssociationForm from './steps/SetAssociation/SetAssociation';
import Finish from './steps/Finish/Finish';

class Wizard extends Component {
  static propTypes = {
    authorId: PropTypes.number,
    createBatch: PropTypes.func,
    getJiraProjects: PropTypes.func,
    getProjectAssociation: PropTypes.func,
    getSimtrackUsersByName: PropTypes.func,
    isOpen: PropTypes.bool,
    jiraAuthorize: PropTypes.func,
    jiraCreateProject: PropTypes.func,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func,
    project: PropTypes.object,
    projectData: PropTypes.object,
    projects: PropTypes.array,
    setAssociation: PropTypes.func,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      currentState: states.AUTH
    };
    this.stateMachine = new StateMachine();
  }

  // Auth forward function
  authNext = formData => {
    this.props
      .jiraAuthorize(formData)
      .then(res => {
        const { token } = res;
        return token;
      })
      .then(res => {
        return this.props.getJiraProjects({ 'X-Jira-Auth': res });
      })
      .then(res => {
        const currentProject = res.projects.find(project => project.name === this.props.projectData.name);
        return this.props.jiraCreateProject(
          { 'X-Jira-Auth': this.props.token },
          {
            authorId: this.props.authorId,
            prefix: this.props.projectData.prefix,
            jiraProjectId: currentProject ? currentProject.id : null
          }
        );
      })
      .then(() => {
        this.setState({
          currentState: this.stateMachine.forward(this.state.currentState)
        });
      });
  };

  // Create project forward function
  createProjectNext = (headers, formData) => {
    this.props.jiraCreateProject(headers, formData).then(res => {
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
            <Auth lang={lang} nextStep={this.authNext} />
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
              getSimtrackUsers={this.props.getSimtrackUsersByName}
              getProjectAssociation={this.props.getProjectAssociation}
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
