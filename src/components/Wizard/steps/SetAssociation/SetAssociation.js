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
      selectedJiraCols: [],

      summaryJiraSelect: [] // selected + associated
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
    let associatedArr;
    switch (key) {
      case 'jiraIssueType':
        if (~(ind = this.state.selectedJiraCols.findIndex(el => el.id === value.id))) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          this.setState({ selectedJiraCols: arr });
        } else {
          this.setState({ selectedJiraCols: [...this.state.selectedJiraCols, value] });
        }
        break;
      case 'jiraUser':
        this.setState({ selectedJiraCols: [value] });
        break;
      case 'jiraStatusType':
        if (~(ind = this.state.selectedJiraCols.findIndex(el => el.id === value.id))) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          this.setState({ selectedJiraCols: arr });
        } else {
          this.setState({ selectedJiraCols: [...this.state.selectedJiraCols, value] });
        }
        break;
      case 'simtrackIssueType':
        associatedArr = this.state.issueTypesAssociation.filter(e => value.id === e.internalIssueTypeId);
        this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      case 'simtrackStatusType':
        associatedArr = this.state.issueTypesAssociation.filter(e => value.id === e.internalIssueTypeId);
        this.setState({ selectedJiraCols: [...this.state.statusesAssociation], selectedSimtrackCol: value });
        break;
      case 'simtrackUser':
        associatedArr = this.state.issueTypesAssociation.filter(e => value.id === e.internalIssueTypeId);
        this.setState({ selectedJiraCols: [...this.state.userEmailAssociation], selectedSimtrackCol: value });
        break;
      default:
        break;
    }
  };

  associate = () => {
    let arr;
    switch (this.state.currentState) {
      case associationStates.USERS:
        arr = this.state.selectedJiraCols.map(e => {
          return { email: e.email, internalUserId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          userEmailAssociation: [...arr]
        });
        break;
      case associationStates.ISSUE_TYPES:
        arr = this.state.selectedJiraCols.map(e => {
          return { id: e.id, internalIssueTypeId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          issueTypesAssociation: [...arr]
        });
        break;
      case associationStates.STATUS_TYPES:
        arr = this.state.selectedJiraCols.map(e => {
          return { id: e.id, internalStatusTypeId: this.state.selectedSimtrackCol.id };
        });
        this.setState({
          statusesAssociation: [...arr]
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

  // ----------- TODO: -----------
  // добавить чтобы при клике на симтрек итем показывались привязанные к нему итемы джиры

  // TODO: переписать
  isActiveJiraColItems = id => {
    // TODO: засунуть в стейт selectedJiraCols если он найдет это в переменной ассоциации - гениально!!!!
    switch (this.state.currentState) {
      case associationStates.ISSUE_TYPES:
        return this.state.selectedJiraCols.find(el => `${el.id}` === id);
      case associationStates.STATUS_TYPES:
        return this.state.selectedJiraCols.find(el => `${el.id}` === id);
      case associationStates.USERS:
        return this.state.selectedJiraCols.find(el => `${el.email}` === id);
      default:
        break;
    }
  };

  isActiveSimtrackColItems = id => {
    return this.state.selectedSimtrackCol ? this.state.selectedSimtrackCol.id.toString() === id : false;
  };

  // ----------- TODO: -----------

  renderJiraRow(entity) {
    let id;
    switch (this.state.currentState) {
      case associationStates.USERS:
        id = `${entity.email}`;
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
        id = `${entity.id}`;
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
        id = `${entity.id}`;
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
