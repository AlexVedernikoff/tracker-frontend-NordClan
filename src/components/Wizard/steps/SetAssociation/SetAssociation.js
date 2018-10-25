import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './setAssociation.json';
import * as css from './setAssociation.scss';

import StateMachine from '../../StateMachine';
import Button from '../../../Button';
import { associationStates } from './AssociationStates';

class SetAssociationForm extends Component {
  static propTypes = {
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    project: PropTypes.object,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      currentState: associationStates.ISSUE_TYPES
    };
    this.stateMachine = new StateMachine();
  }

  onChange = (name, e) => {
    this.setState({
      [name]: e ? e.target.value : ''
    });
  };

  renderJiraRow(entity) {
    let id;
    switch (this.state.currentState) {
      case 'USERS':
        id = `${entity.key}${entity.email}`;
        return (
          <tr key={id} className={css.userRow}>
            <td>{entity.email}</td>
          </tr>
        );
      default:
        id = `${entity.id}${entity.description}`;
        return (
          <tr key={id} className={css.userRow}>
            <td>{entity.name}</td>
          </tr>
        );
    }
  }

  renderSimtrackRow(entity) {
    let id;
    switch (this.state.currentState) {
      case 'USERS':
        id = `${entity.key}${entity.email}`;
        return (
          <tr key={id} className={css.userRow}>
            <td>{entity.email}</td>
          </tr>
        );
      default:
        id = `${entity.id}${entity.nameEn}`;
        return (
          <tr key={id} className={css.userRow}>
            <td>{entity.name}</td>
          </tr>
        );
    }
  }

  nextAssociationStep = () => {
    this.setState({
      currentState: this.stateMachine.nextAssociation(this.state.currentState)
    });
  };

  previousAssociationStep = () => {
    this.setState({
      currentState: this.stateMachine.prevoiusAssociation(this.state.currentState)
    });
  };

  render() {
    const { lang, previousStep, nextStep, project, taskTypes, taskStatuses } = this.props;
    let JiraTableBody;
    let SimtrackTableBody;
    switch (this.state.currentState) {
      case associationStates.ISSUE_TYPES:
        JiraTableBody = project.issue_types.map(entity => {
          return this.renderJiraRow(entity);
        });
        SimtrackTableBody = taskTypes.map(entity => {
          return this.renderSimtrackRow(entity);
        });
        break;
      case associationStates.STATUS_TYPES:
        JiraTableBody = project.status_types.map(entity => {
          return this.renderJiraRow(entity);
        });
        SimtrackTableBody = taskStatuses.map(entity => {
          return this.renderSimtrackRow(entity);
        });
        break;
      case associationStates.USERS:
        JiraTableBody = project.users.map(entity => {
          return this.renderJiraRow(entity);
        });
        SimtrackTableBody = [];
        break;
      default:
        break;
    }

    return (
      <div>
        <h3>
          <p>{localize[lang].CREATE_PROJECT}</p>
        </h3>
        <hr />
        <label className={css.formField}>
          <table className={css.usersRolesTable}>
            <thead>
              <tr className={css.usersRolesHeader}>
                <th>{localize[this.props.lang].SIMTRACK_EMAIL}</th>
              </tr>
            </thead>
            <tbody>{JiraTableBody}</tbody>
          </table>

          <table className={css.usersRolesTable}>
            <thead>
              <tr className={css.usersRolesHeader}>
                <th>{localize[this.props.lang].SIMTRACK_EMAIL}</th>
              </tr>
            </thead>
            <tbody>{SimtrackTableBody}</tbody>
          </table>
        </label>
        {this.state.currentState === associationStates.ISSUE_TYPES ? (
          <Button text="Назад" onClick={() => previousStep(this.state)} type="green" />
        ) : (
          <Button text="Назад" onClick={this.previousAssociationStep} type="green" />
        )}
        {this.state.currentState === associationStates.USERS ? (
          <Button
            text="Вперед2"
            onClick={() => nextStep({ 'X-Jira-Auth': this.props.token }, this.state)}
            type="green"
          />
        ) : (
          <Button text="Вперед1" onClick={this.nextAssociationStep} type="green" />
        )}
      </div>
    );
  }
}

export default SetAssociationForm;
