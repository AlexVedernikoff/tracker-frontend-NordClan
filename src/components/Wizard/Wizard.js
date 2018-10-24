import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import * as css from './Wizard.scss';
import { states } from './States';
import Button from '../Button';
import StateMachine from './StateMachine';

import Auth from './Steps/Auth/Auth';
import CreateProject from './Steps/CreateProject/CreateProject';
import SetAssociationIssueTypesForm from './Steps/SetAssociation/SetAssociation';

class Wizard extends Component {
  static propTypes = {
    authorId: PropTypes.number,
    getJiraProjects: PropTypes.func,
    isOpen: PropTypes.bool,
    jiraAuthorize: PropTypes.func,
    jiraCreateProject: PropTypes.func,
    lang: PropTypes.string,
    onRequestClose: PropTypes.func,
    project: PropTypes.object,
    projects: PropTypes.array,
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
  createProjectPrevious = () => {
    this.setState({
      currentState: this.stateMachine.backward(this.state.currentState)
    });
  };

  currentStep(lang) {
    switch (this.state.currentState) {
      case states.AUTH:
        return (
          <div>
            <Auth lang={lang} nextStep={this.authNext} />
          </div>
        );
      case states.CREATE_PROJECT:
        return (
          <div>
            <CreateProject
              token={this.props.token}
              lang={lang}
              getJiraProjects={this.props.getJiraProjects}
              previousStep={this.createProjectPrevious}
              nextStep={this.createProjectNext}
              jiraProjects={this.props.projects}
              authorId={this.props.authorId}
            />
          </div>
        );
      case states.SET_ASSOCIATIONS:
        return (
          <div>
            <SetAssociationIssueTypesForm
              lang={lang}
              previousStep={this.createProjectPrevious}
              nextStep={this.createProjectNext}
              project={this.props.project}
            />
          </div>
        );
      case states.FINISH:
        return (
          <div>
            <div>FINISH</div>
            <Button text="Назад" type="green" />
            <Button text="Вперед" type="green" />
          </div>
        );
      default:
        return (
          <div>
            <div>default</div>
            <Button text="Назад" type="green" />
            <Button text="Вперед" type="green" />
          </div>
        );
    }
  }

  render() {
    const { lang, isOpen, onRequestClose } = this.props;
    const {} = this.state;

    return (
      <div>
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <div className={css.baseForm}>
            <div>{this.currentStep(lang)}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Wizard;
