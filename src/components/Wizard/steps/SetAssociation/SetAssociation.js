import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './setAssociation.json';
import * as css from './setAssociation.scss';

import cn from 'classnames';

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
      userEmailAssociation: [],

      selectedSimtrackCol: null,
      selectedJiraCols: []
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
    let ind;
    switch (key) {
      case 'jiraIssueType':
        // multiselect
        if (~(ind = this.state.selectedJiraCols.findIndex(el => el.id === value.id))) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          this.setState({ selectedJiraCols: arr });
        } else {
          this.setState({ selectedJiraCols: [...this.state.selectedJiraCols, value] });
        }
        break;
      case 'jiraUser':
        // singleselect
        this.setState({ selectedJiraCols: [value] });
        break;
      case 'jiraStatusType':
        // multiselect
        if (~(ind = this.state.selectedJiraCols.findIndex(el => el.id === value.id))) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          this.setState({ selectedJiraCols: arr });
        } else {
          this.setState({ selectedJiraCols: [...this.state.selectedJiraCols, value] });
        }
        break;
      case 'simtrackIssueType':
        this.setState({ selectedJiraCols: [], selectedSimtrackCol: value });
        break;
      case 'simtrackStatusType':
        this.setState({ selectedJiraCols: [], selectedSimtrackCol: value });
        break;
      case 'simtrackUser':
        this.setState({ selectedJiraCols: [], selectedSimtrackCol: value });
        break;
      default:
        break;
    }
  };

  associate = () => {
    console.log(this.state.issueTypesAssociation, this.state.statusesAssociation, this.state.userEmailAssociation);
    let arr;
    switch (this.state.currentState) {
      case associationStates.USERS:
        arr = this.state.selectedJiraCols.map(e => {
          return { externalUserEmail: e.email, internalUserId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          userEmailAssociation: [...this.state.userEmailAssociation, ...arr]
        });
        break;
      case associationStates.ISSUE_TYPES:
        arr = this.state.selectedJiraCols.map(e => {
          return { externalIssueTypeId: e.id, internalIssueTypeId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          issueTypesAssociation: [...this.state.issueTypesAssociation, ...arr]
        });
        break;
      case associationStates.STATUS_TYPES:
        arr = this.state.selectedJiraCols.map(e => {
          return { externalStatusTypeId: e.id, internalStatusTypeId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          statusesAssociation: [...this.state.statusesAssociation, ...arr]
        });
        break;
      default:
        break;
    }
  };

  // --------------------------------

  isDisabledAssociation = () => {
    return !(this.state.selectedSimtrackCol && this.state.selectedJiraCols.length > 0);
  };

  isActiveJiraColItems = id => {
    switch (this.state.currentState) {
      case associationStates.USERS:
        return this.state.selectedJiraCols.find(el => `${el.key}${el.email}` === id);
      default:
        return this.state.selectedJiraCols.find(el => `${el.id}${el.description}` === id);
    }
  };

  isActiveSimtrackColItems = id => {
    return this.state.selectedSimtrackCol ? this.state.selectedSimtrackCol.id.toString() === id : false;
  };

  renderJiraRow(entity) {
    let id;
    switch (this.state.currentState) {
      case associationStates.USERS:
        id = `${entity.key}${entity.email}`;
        return (
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveJiraColItems(id)
              }))
            }
            onClick={() => this.select('jiraUser', entity)}
          >
            <td>{entity.email}</td>
          </tr>
        );
      case associationStates.ISSUE_TYPES:
        id = `${entity.id}${entity.description}`;
        return (
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveJiraColItems(id)
              }))
            }
            onClick={() => this.select('jiraIssueType', entity)}
          >
            <td>{entity.name}</td>
          </tr>
        );
      case associationStates.STATUS_TYPES:
        id = `${entity.id}${entity.description}`;
        return (
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveJiraColItems(id)
              }))
            }
            onClick={() => this.select('jiraStatusType', entity)}
          >
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
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveSimtrackColItems(id)
              }))
            }
            onClick={() => this.select('simtrackUser', entity)}
          >
            <td>{entity.fullNameRu}</td>
          </tr>
        );
      case associationStates.ISSUE_TYPES:
        id = `${entity.id}`;
        return (
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveSimtrackColItems(id)
              }))
            }
            onClick={() => this.select('simtrackIssueType', entity)}
          >
            <td>{entity.name}</td>
          </tr>
        );
      case associationStates.STATUS_TYPES:
        id = `${entity.id}`;
        return (
          <tr
            key={id}
            className={
              (css.userRow,
              cn(css.userRow, {
                [css.userRow__active]: this.isActiveSimtrackColItems(id)
              }))
            }
            onClick={() => this.select('simtrackStatusType', entity)}
          >
            <td>{entity.name}</td>
          </tr>
        );
      default:
        break;
    }
  }

  nextAssociationStep = () => {
    this.setState({
      currentState: this.stateMachine.nextAssociation(this.state.currentState),
      selectedSimtrackCol: null,
      selectedJiraCols: []
    });
  };

  previousAssociationStep = () => {
    this.setState({
      currentState: this.stateMachine.prevoiusAssociation(this.state.currentState),
      selectedSimtrackCol: null,
      selectedJiraCols: []
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

    const formLayout = {
      firstCol: 6,
      secondCol: 6
    };

    return (
      <div className={css.mainContainer}>
        <label className={css.formField}>
          <Row>
            <div className={css.innerFirstCol}>
              <Col xs={12} sm={formLayout.firstCol}>
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
                          autoFocus
                        />
                      </tr>
                    ) : null}
                    {SimtrackTableBody}
                  </tbody>
                </table>
              </Col>
            </div>
            <div className={css.innerFirstCol}>
              <Col xs={12} sm={formLayout.secondCol}>
                <table className={css.usersRolesTable}>
                  <thead>
                    <tr className={css.usersRolesHeader}>
                      <th>{localize[this.props.lang].SIMTRACK_EMAIL}</th>
                    </tr>
                  </thead>
                  <tbody>{JiraTableBody}</tbody>
                </table>
              </Col>
            </div>
          </Row>
        </label>

        <Row center="xs" className={css.associationRow}>
          <Button text="Ассоциация" onClick={this.associate} type="green" disabled={this.isDisabledAssociation()} />
        </Row>
        <Row>
          <Col xs={12} sm={formLayout.firstCol}>
            <Row center="xs">
              {this.state.currentState === associationStates.ISSUE_TYPES ? (
                <Button text="Назад" onClick={() => previousStep(this.state)} type="green" />
              ) : (
                <Button text="Назад" onClick={this.previousAssociationStep} type="green" />
              )}
            </Row>
          </Col>
          <Col xs={12} sm={formLayout.secondCol}>
            <Row center="xs">
              {this.state.currentState === associationStates.USERS ? (
                <Button
                  text="Вперед2"
                  onClick={() => nextStep({ 'X-Jira-Auth': this.props.token }, this.state)}
                  type="green"
                />
              ) : (
                <Button text="Вперед1" onClick={this.nextAssociationStep} type="green" />
              )}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SetAssociationForm;
