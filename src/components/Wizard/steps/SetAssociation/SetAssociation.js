import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './SetAssociation.json';
import * as css from './SetAssociation.scss';

import cn from 'classnames';

import StateMachine from '../../StateMachine';
import Button from '../../../Button';
import { Async } from 'react-select';
import { associationStates } from './AssociationStates';
import debounce from 'lodash/debounce';
import { getFullName } from '../../../../utils/NameLocalisation.js';

class SetAssociationForm extends Component {
  static propTypes = {
    getJiraIssueAndStatusTypes: PropTypes.func,
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
    this.props.getJiraIssueAndStatusTypes(this.props.project.id, this.props.token);
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

    this.setState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
  };

  selectUser = value => {
    const users = this.state.users;
    const newUser = { id: value.value, fullNameRu: value.label };
    users.push(newUser);
    this.setState({ users });
    this.setState({ selectedSimtrackCol: newUser });
  };

  getOptions = input => {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    return this.props.getSimtrackUsers(input).then(users => {
      return { options: users.map(user => ({ value: user.id, label: getFullName(user) })) };
    });
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
        this.setState({ selectedJiraCols: [value] }, this.associateOnClick(key, value));
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
        foundIndex = userEmailAssociation.findIndex(el => el.internalUserId === association.internalUserId);
        if (foundIndex !== -1) {
          if (userEmailAssociation[foundIndex].externalUserEmail === association.externalUserEmail) {
            newArr.splice(foundIndex, 1);
          } else {
            newArr.splice(foundIndex, 1, association);
          }
        } else {
          newArr.push(association);
        }
        this.setState({ userEmailAssociation: newArr }, () => log(this.state.userEmailAssociation));
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
        const association = this.state.userEmailAssociation.find(el => +el.internalUserId === +entity.id);
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
            <td>
              <p>{entity.fullNameRu}</p>
              <p>{association ? association.externalUserEmail : 'not associated'}</p>
            </td>
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

  filtredJiraUsers = users => {
    const { userEmailAssociation } = this.state;
    const pickedEmails = userEmailAssociation.map(el => el.externalUserEmail);
    return users.filter(user => !pickedEmails.includes(user.email));
  };

  render() {
    const { lang, previousStep, nextStep, project, taskTypes, taskStatuses } = this.props;
    let JiraTableBody;
    let SimtrackTableBody;
    switch (this.state.currentState) {
      case associationStates.ISSUE_TYPES:
        if (project.issue_types) {
          JiraTableBody = project.issue_types.map(entity => {
            return this.renderJiraRow(entity);
          });
          SimtrackTableBody = taskTypes.map(entity => {
            return this.renderSimtrackRow(entity);
          });
        }
        break;
      case associationStates.STATUS_TYPES:
        if (project.status_types) {
          JiraTableBody = project.status_types.map(entity => {
            return this.renderJiraRow(entity);
          });
          SimtrackTableBody = taskStatuses.map(entity => {
            return this.renderSimtrackRow(entity);
          });
        }
        break;
      case associationStates.USERS:
        if (project.users) {
          JiraTableBody = this.filtredJiraUsers(project.users).map(entity => {
            return this.renderJiraRow(entity);
          });
          SimtrackTableBody = this.state.users.map(entity => {
            return this.renderSimtrackRow(entity);
          });
        }
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
                    {this.state.currentState === associationStates.USERS ? (
                      <tr className={css.userRow}>
                        <Async
                          autoFocus
                          name="user_association"
                          loadOptions={this.getOptions}
                          onChange={this.selectUser}
                          placeholder={localize[lang].NAME}
                          filterOptions={options => {
                            return options;
                          }}
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
