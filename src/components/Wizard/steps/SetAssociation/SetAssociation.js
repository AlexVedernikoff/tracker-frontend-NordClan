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
    getProjectAssociation: PropTypes.func,
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

  componentDidMount() {
    this.props.getProjectAssociation(this.props.project.id).then(association => {
      this.setState(
        {
          issueTypesAssociation: association.issueTypesAssociation,
          statusesAssociation: association.statusesAssociation,
          userEmailAssociation: association.userEmailAssociation
        },
        () => this.setDefault()
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentState !== this.state.currentState) this.setDefault();
  }

  setDefault = () => {
    const { currentState, issueTypesAssociation, statusesAssociation, userEmailAssociation } = this.state;
    let associatedArr;
    let value;
    switch (currentState) {
      case associationStates.USERS:
        value = this.state.userEmailAssociation[0];
        associatedArr = userEmailAssociation.filter(e => (value.internalUserId || value.id) === e.internalUserId);
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

    this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
  };

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
    let newState;
    switch (key) {
      case 'jiraIssueType':
        if (
          ~(ind = this.state.selectedJiraCols.findIndex(
            el => (el.externalTaskTypeId ? el.externalTaskTypeId.toString() === value.id : el.id === value.id)
          ))
        ) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          newState = arr;
        } else {
          newState = [...this.state.selectedJiraCols, value];
        }
        this.setState({ selectedJiraCols: newState }, this.associateOnClick(key, value));
        break;
      case 'jiraUser':
        if (this.state.selectedJiraCols.length > 0) {
          newState = [];
        } else {
          newState = [value];
        }
        this.setState({ selectedJiraCols: newState }, this.associateOnClick(key, value));
        break;
      case 'jiraStatusType':
        if (
          ~(ind = this.state.selectedJiraCols.findIndex(
            el => (el.externalStatusId ? el.externalStatusId.toString() === value.id : el.id === value.id)
          ))
        ) {
          const arr = [...this.state.selectedJiraCols];
          arr.splice(ind, 1);
          newState = arr;
        } else {
          newState = [...this.state.selectedJiraCols, value];
        }
        this.setState({ selectedJiraCols: newState }, this.associateOnClick(key, value));
        break;
      case 'simtrackIssueType':
        associatedArr = this.state.issueTypesAssociation.filter(e => value.id === e.internalTaskTypeId);
        this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      case 'simtrackStatusType':
        associatedArr = this.state.statusesAssociation.filter(e => value.id === e.internalStatusId);
        this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      case 'simtrackUser':
        associatedArr = this.state.userEmailAssociation.filter(
          e => (value.internalUserId || value.id) === e.internalUserId
        );
        this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      default:
        break;
    }
  };

  associateOnClick = (key, value) => {
    const { issueTypesAssociation, statusesAssociation, userEmailAssociation, selectedSimtrackCol } = this.state;
    if (!selectedSimtrackCol) return;
    const { id } = selectedSimtrackCol;
    let newArr;
    let association;
    let foundIndex;
    switch (key) {
      case 'jiraIssueType':
        newArr = issueTypesAssociation;
        association = {
          externalTaskTypeId: value.externalTaskTypeId ? +value.externalTaskTypeId : +value.id,
          internalTaskTypeId: +id
        };
        foundIndex = issueTypesAssociation.findIndex(
          el =>
            el.externalTaskTypeId === association.externalTaskTypeId &&
            el.internalTaskTypeId === association.internalTaskTypeId
        );
        if (foundIndex !== -1) {
          newArr.splice(foundIndex, 1);
        } else {
          newArr.push(association);
        }
        this.setState({ issueTypesAssociation: newArr });
        break;
      case 'jiraStatusType':
        newArr = statusesAssociation;
        association = {
          externalStatusId: value.externalStatusId ? +value.externalStatusId : +value.id,
          internalStatusId: +id
        };
        foundIndex = statusesAssociation.findIndex(
          el =>
            el.externalStatusId === association.externalStatusId && el.internalStatusId === association.internalStatusId
        );
        if (foundIndex !== -1) {
          newArr.splice(foundIndex, 1);
        } else {
          newArr.push(association);
        }
        this.setState({ statusesAssociation: newArr });
        break;
      case 'jiraUser':
        newArr = userEmailAssociation;
        association = {
          externalUserEmail: value.email,
          internalUserId: +id,
          fullNameRu: this.state.selectedSimtrackCol.fullNameRu
        };
        foundIndex = userEmailAssociation.findIndex(
          el =>
            el.externalUserEmail === association.externalUserEmail && el.internalUserId === association.internalUserId
        );
        if (foundIndex !== -1) {
          newArr.splice(foundIndex, 1);
        } else {
          newArr.push(association);
        }
        this.setState({ userEmailAssociation: newArr });
        break;
      default:
        break;
    }
  };

  // --------------------------------

  isDisabledAssociation = () => {
    return !this.state.selectedSimtrackCol;
  };

  isActiveJiraColItems = id => {
    switch (this.state.currentState) {
      case associationStates.ISSUE_TYPES:
        return this.state.selectedJiraCols.find(el => `${el.id}` === id || `${el.externalTaskTypeId}` === id);
      case associationStates.STATUS_TYPES:
        return this.state.selectedJiraCols.find(el => `${el.id}` === id || `${el.externalStatusId}` === id);
      case associationStates.USERS:
        return this.state.selectedJiraCols.find(el => `${el.email}` === id || `${el.externalUserEmail}` === id);
      default:
        break;
    }
  };

  isActiveSimtrackColItems = id => {
    if (this.state.selectedSimtrackCol) {
      if (this.state.selectedSimtrackCol.id) {
        return this.state.selectedSimtrackCol.id.toString() === id;
      }
      if (this.state.selectedSimtrackCol.internalUserId) {
        return this.state.selectedSimtrackCol.internalUserId.toString() === id;
      }
    } else return false;
  };

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
        id = `${entity.id || entity.internalUserId}`;
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
    let SimtrackAssociatedUsers;
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
        SimtrackAssociatedUsers = this.state.userEmailAssociation.map(u => {
          return this.renderSimtrackRow(u);
        });
        SimtrackTableBody = this.state.users.map(entity => {
          return this.renderSimtrackRow(entity);
        });
        break;
      default:
        break;
    }

    return (
      <div className={css.mainContainer}>
        <label className={css.formField}>
          <Row>
            <div className={css.innerFirstCol}>
              <Col xs={12}>
                <table className={css.usersRolesTable}>
                  <thead>
                    <tr className={css.usersRolesHeader}>
                      {this.state.currentState === associationStates.ISSUE_TYPES ? (
                        <th>{localize[this.props.lang].SIMTRACK_ISSUE_TYPES}</th>
                      ) : null}
                      {this.state.currentState === associationStates.STATUS_TYPES ? (
                        <th>{localize[this.props.lang].SIMTRACK_STATUS_TYPES}</th>
                      ) : null}
                      {this.state.currentState === associationStates.USERS ? (
                        <th>{localize[this.props.lang].SIMTRACK_USER}</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    <tbody>{SimtrackAssociatedUsers}</tbody>
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
              <Col xs={12}>
                <table className={css.usersRolesTable}>
                  <thead>
                    <tr className={css.usersRolesHeader}>
                      {this.state.currentState === associationStates.ISSUE_TYPES ? (
                        <th>{localize[this.props.lang].JIRA_ISSUE_TYPES}</th>
                      ) : null}
                      {this.state.currentState === associationStates.STATUS_TYPES ? (
                        <th>{localize[this.props.lang].JIRA_STATUS_TYPES}</th>
                      ) : null}
                      {this.state.currentState === associationStates.USERS ? (
                        <th>{localize[this.props.lang].JIRA_EMAIL}</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>{JiraTableBody}</tbody>
                </table>
              </Col>
            </div>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          {this.state.currentState === associationStates.ISSUE_TYPES ? (
            <Button text="Назад" onClick={() => previousStep(this.state)} type="green" />
          ) : (
            <Button text="Назад" onClick={this.previousAssociationStep} type="green" />
          )}
          {this.state.currentState === associationStates.USERS ? (
            <Button
              text="Вперед"
              onClick={() => nextStep({ 'X-Jira-Auth': this.props.token }, this.state)}
              type="green"
            />
          ) : (
            <Button text="Вперед" onClick={this.nextAssociationStep} type="green" />
          )}
        </div>
      </div>
    );
  }
}

export default SetAssociationForm;
