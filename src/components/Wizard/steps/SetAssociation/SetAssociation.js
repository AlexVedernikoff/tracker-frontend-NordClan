import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './setAssociation.json';
import * as css from './setAssociation.scss';

import StateMachine from '../../StateMachine';
import Button from '../../../Button';
import Input from '../../../Input';
import { associationStates } from './AssociationStates';
import debounce from 'lodash/debounce';

class SetAssociationForm extends Component {
  static propTypes = {
    getSimtrackUsers: PropTypes.func,
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
      currentState: associationStates.ISSUE_TYPES,
      users: [],

      issueTypesAssociation: [],
      statusesAssociation: [],
      userEmailAssociation: []
    };
    this.stateMachine = new StateMachine();
    this.searchOnChange = debounce(this.searchOnChange, 400);
  }

  searchOnChange = name => {
    const userName = name.trim();
    if (userName.length > 1) {
      this.props.getSimtrackUsers(name).then(users => {
        this.setState({
          users
        });
      });
    }
  };

  select = (key, value) => {
    this.setState({ [key]: value });
  };

  associate = () => {
    switch (this.state.currentState) {
      case associationStates.USERS:
        this.setState({
          userEmailAssociation: [
            this.state.issueTypesAssociation,
            ...{ externalUserEmail: this.state.jiraUser, internalUserId: this.state.simtrackUser }
          ]
        });
        break;
      case associationStates.ISSUE_TYPES:
        this.setState({
          issueTypesAssociation: [
            this.state.issueTypesAssociation,
            ...{ externalTaskTypeId: this.state.jiraIssueType, internalTaskTypeId: this.state.simtrackIssueType }
          ]
        });
        break;
      case associationStates.STATUS_TYPES:
        this.setState({
          statusesAssociation: [
            this.state.issueTypesAssociation,
            ...{ externalStatusId: this.state.jiraStatusType, internalStatusId: this.state.simtrackStatusType }
          ]
        });
        break;
      default:
        break;
    }
  };

  // --------------------------------

  isDisabledAssociation = () => {
    switch (this.state.currentState) {
      case associationStates.USERS:
        return !(this.state.jiraUser && this.state.simtrackUser);
      case associationStates.ISSUE_TYPES:
        return !(this.state.jiraIssueType && this.state.simtrackIssueType);
      case associationStates.STATUS_TYPES:
        return !(this.state.jiraStatusType && this.state.simtrackStatusType);
      default:
        return true;
    }
  };

  renderJiraRow(entity) {
    let id;
    switch (this.state.currentState) {
      case associationStates.USERS:
        id = `${entity.key}${entity.email}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('jiraUser', entity.email)}>
            <td>{entity.email}</td>
          </tr>
        );
      case associationStates.ISSUE_TYPES:
        id = `${entity.id}${entity.description}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('jiraIssueType', entity.id)}>
            <td>{entity.name}</td>
          </tr>
        );
      case associationStates.STATUS_TYPES:
        id = `${entity.id}${entity.description}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('jiraStatusType', entity.id)}>
            <td>{entity.name}</td>
          </tr>
        );
      default:
        break;
    }
  }

  renderSimtrackRow(entity) {
    let id;
    switch (this.state.currentState) {
      case associationStates.USERS:
        id = `${entity.id}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('simtrackUser', entity.id)}>
            <td>{entity.fullNameRu}</td>
          </tr>
        );
      case associationStates.ISSUE_TYPES:
        id = `${entity.id}${entity.nameEn}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('simtrackIssueType', entity)}>
            <td>{entity.name}</td>
          </tr>
        );
      case associationStates.STATUS_TYPES:
        id = `${entity.id}${entity.nameEn}`;
        return (
          <tr key={id} className={css.userRow} onClick={() => this.select('simtrackStatusType', entity)}>
            <td>{entity.name}</td>
          </tr>
        );
      default:
        break;
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
        SimtrackTableBody = this.state.users.map(entity => {
          return this.renderSimtrackRow(entity);
        });
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
            <tbody>
              {this.state.currentState === associationStates.USERS ? (
                <tr className={css.userRow}>
                  <Input
                    name="user_association"
                    placeholder={localize[lang].NAME}
                    onChange={e => this.searchOnChange(e.target.value)}
                    autofocus
                  />
                </tr>
              ) : null}
              {SimtrackTableBody}
            </tbody>
          </table>
        </label>
        <Button text="Ассоциация" onClick={() => null} type="green" disabled={this.isDisabledAssociation()} />
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
