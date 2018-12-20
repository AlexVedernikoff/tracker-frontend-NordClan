import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './SetAssociation.json';
import * as css from './SetAssociation.scss';

import cn from 'classnames';

import Button from '../../../Button';
import { Async } from 'react-select';
import { associationStates } from './AssociationStates';
import debounce from 'lodash/debounce';
import { getFullName } from '../../../../utils/NameLocalisation.js';
import { createStepsManager } from '../../wizardConfigurer';
import { defaultErrorHandler } from '../../../../actions/Common';

const ASSOCIATIONS_STEPS = [associationStates.ISSUE_TYPES, associationStates.STATUS_TYPES, associationStates.USERS];

class SetAssociationForm extends Component {
  static propTypes = {
    associationState: PropTypes.object,
    getJiraIssueAndStatusTypes: PropTypes.func,
    getProjectAssociation: PropTypes.func,
    getSimtrackUsers: PropTypes.func,
    jiraProjectId: PropTypes.number,
    lang: PropTypes.string,
    mergeAssociationState: PropTypes.func,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    project: PropTypes.object,
    setAssociationAndTypes: PropTypes.func,
    setDefault: PropTypes.func,
    simtrackProjectId: PropTypes.number,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.stepsManager = createStepsManager(ASSOCIATIONS_STEPS);
    this.state = {
      currentStep: this.stepsManager.currentStep
    };
    this.searchOnChange = debounce(this.searchOnChange, 400);
  }

  async componentDidMount() {
    try {
      const jiraTypes = await this.props.getJiraIssueAndStatusTypes(this.props.jiraProjectId, this.props.token);
      console.log('load', jiraTypes);
      const associations = await this.props.getProjectAssociation(this.props.simtrackProjectId);
      this.props.setAssociationAndTypes(associations, jiraTypes);
    } catch (e) {
      defaultErrorHandler(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentStep !== this.state.currentStep) this.setDefault();
  }

  selectUser = value => {
    const users = this.props.associationState.users;
    const newUser = { id: value.value, fullNameRu: value.label };
    users.push(newUser);
    this.props.mergeAssociationState({ users });
    this.props.mergeAssociationState({ selectedSimtrackCol: newUser });
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
        this.props.mergeAssociationState({
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
          ~(ind = this.props.associationState.selectedJiraCols.findIndex(
            el => (el.externalTaskTypeId ? el.externalTaskTypeId.toString() === value.id : el.id === value.id)
          ))
        ) {
          const arr = [...this.props.associationState.selectedJiraCols];
          arr.splice(ind, 1);
          newState = arr;
        } else {
          newState = [...this.props.associationState.selectedJiraCols, value];
        }
        this.props.mergeAssociationState({ selectedJiraCols: newState }, this.associateOnClick(key, value));
        break;
      case 'jiraUser':
        this.props.mergeAssociationState({ selectedJiraCols: [value] }, this.associateOnClick(key, value));
        break;
      case 'jiraStatusType':
        if (
          ~(ind = this.props.associationState.selectedJiraCols.findIndex(
            el => (el.externalStatusId ? el.externalStatusId.toString() === value.id : el.id === value.id)
          ))
        ) {
          const arr = [...this.props.associationState.selectedJiraCols];
          arr.splice(ind, 1);
          newState = arr;
        } else {
          newState = [...this.props.associationState.selectedJiraCols, value];
        }
        this.props.mergeAssociationState({ selectedJiraCols: newState }, this.associateOnClick(key, value));
        break;
      case 'simtrackIssueType':
        associatedArr = this.props.associationState.issueTypesAssociation.filter(
          e => value.id === e.internalTaskTypeId
        );
        this.props.mergeAssociationState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      case 'simtrackStatusType':
        associatedArr = this.props.associationState.statusesAssociation.filter(e => value.id === e.internalStatusId);
        this.props.mergeAssociationState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      case 'simtrackUser':
        associatedArr = this.props.associationState.userEmailAssociation.filter(
          e => (value.internalUserId || value.id) === e.internalUserId
        );
        this.props.mergeAssociationState({ selectedJiraCols: [...associatedArr], selectedSimtrackCol: value });
        break;
      default:
        break;
    }
  };

  associateOnClick = (key, value) => {
    const {
      issueTypesAssociation,
      statusesAssociation,
      userEmailAssociation,
      selectedSimtrackCol
    } = this.props.associationState;
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
        this.props.mergeAssociationState({ issueTypesAssociation: newArr });
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
        this.props.mergeAssociationState({ statusesAssociation: newArr });
        break;
      case 'jiraUser':
        newArr = userEmailAssociation;
        association = {
          externalUserEmail: value.email,
          internalUserId: +id,
          fullNameRu: this.props.associationState.selectedSimtrackCol.fullNameRu
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
        this.props.mergeAssociationState({ userEmailAssociation: newArr }, () =>
          log(this.props.associationState.userEmailAssociation)
        );
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
    switch (this.state.currentStep) {
      case associationStates.ISSUE_TYPES:
        return this.props.associationState.selectedJiraCols.find(
          el => `${el.id}` === id || `${el.externalTaskTypeId}` === id
        );
      case associationStates.STATUS_TYPES:
        return this.props.associationState.selectedJiraCols.find(
          el => `${el.id}` === id || `${el.externalStatusId}` === id
        );
      case associationStates.USERS:
        return this.props.associationState.selectedJiraCols.find(
          el => `${el.email}` === id || `${el.externalUserEmail}` === id
        );
      default:
        break;
    }
  };

  isActiveSimtrackColItems = id => {
    if (this.props.associationState.selectedSimtrackCol) {
      if (this.props.associationState.selectedSimtrackCol.id) {
        return this.props.associationState.selectedSimtrackCol.id.toString() === id;
      }
      if (this.props.associationState.selectedSimtrackCol.internalUserId) {
        return this.props.associationState.selectedSimtrackCol.internalUserId.toString() === id;
      }
    } else return false;
  };

  renderJiraRow(entity) {
    let id;
    switch (this.props.associationState.currentStep) {
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
    switch (this.state.currentStep) {
      case associationStates.USERS:
        const association = this.props.associationState.userEmailAssociation.find(
          el => +el.internalUserId === +entity.id
        );
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
    this.props.mergeAssociationState(
      {
        selectedSimtrackCol: null,
        selectedJiraCols: []
      },
      () => {
        this.setState({ currentStep: this.stepsManager[this.state.currentStep].forwardStep() });
      }
    );
  };

  previousAssociationStep = () => {
    this.props.mergeAssociationState(
      {
        selectedSimtrackCol: null,
        selectedJiraCols: []
      },
      () => {
        this.setState({ currentStep: this.stepsManager[this.state.currentStep].backwardStep() });
      }
    );
  };

  filtredJiraUsers = users => {
    const { userEmailAssociation } = this.props.associationState;
    const pickedEmails = userEmailAssociation.map(el => el.externalUserEmail);
    return users.filter(user => !pickedEmails.includes(user.email));
  };

  render() {
    const { jiraIssueTypes, jiraStatusTypes } = this.props.associationState;
    const { project, taskTypes, taskStatuses, lang, nextStep } = this.props;
    let JiraTableBody;
    let SimtrackTableBody;
    console.log('jiraIssue', this.props.associationState);
    switch (this.state.currentStep) {
      case associationStates.ISSUE_TYPES:
        if (taskTypes && jiraIssueTypes) {
          JiraTableBody = jiraIssueTypes.map(entity => {
            return this.renderJiraRow(entity);
          });
          SimtrackTableBody = taskTypes.map(entity => {
            return this.renderSimtrackRow(entity);
          });
        }
        break;
      case associationStates.STATUS_TYPES:
        if (taskStatuses && jiraStatusTypes) {
          JiraTableBody = jiraStatusTypes.map(entity => {
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
          SimtrackTableBody = this.props.associationState.users.map(entity => {
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
                      {this.state.currentStep === associationStates.ISSUE_TYPES ? (
                        <th>{localize[lang].SIMTRACK_ISSUE_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.STATUS_TYPES ? (
                        <th>{localize[lang].SIMTRACK_STATUS_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.USERS ? (
                        <th>{localize[lang].SIMTRACK_USER}</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.currentStep === associationStates.USERS ? (
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
                      {this.state.currentStep === associationStates.ISSUE_TYPES ? (
                        <th>{localize[lang].JIRA_ISSUE_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.STATUS_TYPES ? (
                        <th>{localize[lang].JIRA_STATUS_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.USERS ? <th>{localize[lang].JIRA_EMAIL}</th> : null}
                    </tr>
                  </thead>
                  <tbody>{JiraTableBody}</tbody>
                </table>
              </Col>
            </div>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          {this.state.currentStep === associationStates.ISSUE_TYPES ? (
            <Button
              text="Назад"
              onClick={() => this.stepsManager[associationStates.ISSUE_TYPES].backwardStep()}
              type="green"
            />
          ) : (
            <Button text="Назад" onClick={this.previousAssociationStep} type="green" />
          )}
          {this.state.currentStep === associationStates.USERS ? (
            <Button text={localize[lang].GO_AHEAD} onClick={() => nextStep()} type="green" />
          ) : (
            <Button text={localize[lang].GO_AHEAD} onClick={this.nextAssociationStep} type="green" />
          )}
        </div>
      </div>
    );
  }
}

export default SetAssociationForm;
