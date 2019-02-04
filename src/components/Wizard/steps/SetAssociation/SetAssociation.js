import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './SetAssociation.json';
import * as css from './SetAssociation.scss';

import cn from 'classnames';

import Button from '../../../Button';
import { associationStates } from './AssociationStates';
import { createStepsManager } from '../../wizardConfigurer';
import { defaultErrorHandler } from '../../../../actions/Common';
import { capitalize } from '../../../../utils/formatter';
import { IconCheck } from '../../../Icons';

const ASSOCIATIONS_STEPS = [associationStates.ISSUE_TYPES, associationStates.STATUS_TYPES, associationStates.USERS];

class SetAssociationForm extends Component {
  static propTypes = {
    associationState: PropTypes.object,
    getJiraIssueAndStatusTypes: PropTypes.func,
    getJiraProjectUsers: PropTypes.func,
    getProjectAssociation: PropTypes.func,
    getSimtrackUsers: PropTypes.func,
    jiraProjectId: PropTypes.number,
    lang: PropTypes.string,
    mergeAssociationState: PropTypes.func,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    project: PropTypes.object,
    setAssociation: PropTypes.func,
    setDefault: PropTypes.func,
    simtrackProjectId: PropTypes.number,
    simtrackProjectUsers: PropTypes.array,
    taskStatuses: PropTypes.array,
    taskTypes: PropTypes.array,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.stepsManager = createStepsManager(ASSOCIATIONS_STEPS);
    this.state = {
      currentStep: this.stepsManager.currentStep,
      errors: []
    };
  }

  async componentDidMount() {
    try {
      const jiraAssociations = await this.props.getJiraIssueAndStatusTypes(this.props.jiraProjectId, this.props.token);
      const associations = {};
      this.sortJiraData(jiraAssociations);
      this.props.setAssociation(associations, jiraAssociations, this.state.currentStep);
    } catch (e) {
      defaultErrorHandler(e);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentStep !== this.state.currentStep) {
      this.props.setDefault(this.state.currentStep);
    }
  }

  sortJiraData = jiraData => {
    const keys = Object.keys(jiraData);
    keys.forEach(key => {
      jiraData[key].sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  get associationConfig() {
    return {
      [associationStates.ISSUE_TYPES]: {
        associationType: 'issueTypesAssociation',
        externalAssociationKey: 'externalTaskTypeId',
        internalAssociationKey: 'internalTaskTypeId',
        jiraKey: 'id',
        simTrackKey: 'id',
        jiraDisplayField: 'name',
        simTrackDisplayField: 'name',
        oneToOne: false,
        createAssociation: (jiraValue, simTrackValue) => ({
          externalTaskTypeId: jiraValue.id,
          internalTaskTypeId: simTrackValue.id
        })
      },
      [associationStates.STATUS_TYPES]: {
        associationType: 'statusesAssociation',
        externalAssociationKey: 'externalStatusId',
        internalAssociationKey: 'internalStatusId',
        jiraKey: 'id',
        simTrackKey: 'id',
        jiraDisplayField: 'name',
        simTrackDisplayField: 'name',
        oneToOne: false,
        createAssociation: (jiraValue, simTrackValue) => ({
          externalStatusId: jiraValue.id,
          internalStatusId: simTrackValue.id
        })
      },
      [associationStates.USERS]: {
        associationType: 'userEmailAssociation',
        externalAssociationKey: 'externalUserEmail',
        internalAssociationKey: 'internalUserId',
        jiraKey: 'email',
        simTrackKey: 'id',
        jiraDisplayField: 'email',
        simTrackDisplayField: `fullName${capitalize(this.props.lang)}`,
        oneToOne: true,
        createAssociation: (jiraValue, simTrackValue) => ({
          externalUserEmail: jiraValue.email,
          internalUserId: simTrackValue.id,
          fullNameRu: simTrackValue.fullNameRu
        })
      }
    };
  }

  selectJiraCol = value => () => {
    this.props.mergeAssociationState({
      selectedJiraCol: value,
      selectedSimtrackCol: this.getAssociatedSimtrackCol(value)
    });
  };

  getAssociatedSimtrackCol = value => {
    const { associationType, jiraKey, externalAssociationKey } = this.associationConfig[this.state.currentStep];

    return this.props.associationState[associationType].find(
      association => value[jiraKey] === association[externalAssociationKey]
    );
  };

  isValidJiraRow = id => {
    switch (this.state.currentStep) {
      case associationStates.ISSUE_TYPES:
        return this.isValidJiraIssueRow(id);
      case associationStates.STATUS_TYPES:
        return this.isValidJiraStatusRow(id);
      case associationStates.USERS:
        return this.isValidJiraUserRow(id);
      default:
    }
  };

  isValidJiraIssueRow = id => {
    return this.props.associationState.issueTypesAssociation.find(el => +el.externalTaskTypeId === +id);
  };

  isValidJiraStatusRow = id => {
    return this.props.associationState.statusesAssociation.find(el => +el.externalStatusId === +id);
  };

  selectSimtrackCol = value => () => {
    this.createAssociation(value);
  };

  isValidJiraUserRow = email => {
    return this.props.associationState.userEmailAssociation.find(el => el.externalUserEmail === email);
  };

  createAssociation = value => {
    const { associationType, createAssociation, oneToOne } = this.associationConfig[this.state.currentStep];
    const associations = [...this.props.associationState[associationType]];

    const foundAssociationIndex = oneToOne
      ? this.findAssociationForSelectedSimtrackCol(value)
      : this.findAssociationForSelectedJiraCol();

    if (foundAssociationIndex !== -1) {
      associations.splice(foundAssociationIndex, 1);
    }

    const newAssociation = createAssociation(this.props.associationState.selectedJiraCol, value);
    associations.push(newAssociation);

    this.props.mergeAssociationState({ [associationType]: associations });
  };

  findAssociationForSelectedJiraCol = () => {
    const { jiraKey, associationType, externalAssociationKey } = this.associationConfig[this.state.currentStep];
    const { selectedJiraCol } = this.props.associationState;

    return this.props.associationState[associationType].findIndex(
      association => selectedJiraCol[jiraKey] === association[externalAssociationKey]
    );
  };

  findAssociationForSelectedSimtrackCol = value => {
    const { associationType, simTrackKey, internalAssociationKey } = this.associationConfig[this.state.currentStep];

    return this.props.associationState[associationType].findIndex(
      association => association[internalAssociationKey] === value[simTrackKey]
    );
  };

  // --------------------------------

  isJiraColItemActive = id => {
    if (!this.props.associationState.selectedJiraCol) {
      return false;
    }

    const { jiraKey } = this.associationConfig[this.state.currentStep];

    return this.props.associationState.selectedJiraCol[jiraKey] === id;
  };

  isSimtrackColItemActive = id => {
    if (!this.props.associationState.selectedJiraCol) {
      return false;
    }

    const { associationType, internalAssociationKey } = this.associationConfig[this.state.currentStep];
    const foundAssociationIndex = this.findAssociationForSelectedJiraCol();

    if (foundAssociationIndex === -1) {
      return false;
    }

    const foundAssociation = this.props.associationState[associationType][foundAssociationIndex];
    return foundAssociation[internalAssociationKey] === id;
  };

  renderJiraRow(entity) {
    const { jiraKey, jiraDisplayField } = this.associationConfig[this.state.currentStep];
    const id = entity[jiraKey];

    return (
      <tr key={id} onClick={this.selectJiraCol(entity)}>
        <td className={css.iconCheckCell}>
          {this.isValidJiraRow(id) ? (
            <div className={css.circleContainer}>
              <IconCheck />
            </div>
          ) : null}
        </td>
        <td
          className={
            (css.userRow,
            cn(css.userRow, {
              [css.userRow__active]: this.isJiraColItemActive(id)
            }))
          }
        >
          {entity[jiraDisplayField]}
        </td>
      </tr>
    );
  }

  renderSimtrackRow(entity) {
    const { simTrackDisplayField, simTrackKey } = this.associationConfig[this.state.currentStep];
    const id = entity[simTrackKey];

    return (
      <tr
        key={id}
        className={
          (css.userRow,
          cn(css.userRow, {
            [css.userRow__active]: this.isSimtrackColItemActive(id)
          }))
        }
        onClick={this.selectSimtrackCol(entity)}
      >
        <td>{entity[simTrackDisplayField]}</td>
      </tr>
    );
  }

  nextAssociationStep = () => {
    const errors = this.getFormErrors();
    if (errors.length === 0) {
      this.props.mergeAssociationState(
        {
          selectedSimtrackCol: null,
          selectedJiraCols: []
        },
        () => {
          this.setState({
            currentStep: this.stepsManager[this.state.currentStep].forwardStep(),
            errors: []
          });
        }
      );
    } else {
      this.setState({ errors });
    }
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

  getFormErrors = () => {
    const { jiraIssueTypes, jiraStatusTypes } = this.props.associationState;
    const incorrectFields = [];
    switch (this.state.currentStep) {
      case associationStates.ISSUE_TYPES:
        jiraIssueTypes.map(el => {
          if (!this.isValidJiraIssueRow(el.id)) {
            incorrectFields.push(el.id);
          }
        });
        break;
      case associationStates.STATUS_TYPES:
        jiraStatusTypes.map(el => {
          if (!this.isValidJiraStatusRow(el.id)) {
            incorrectFields.push(el.id);
          }
        });
        break;
      case associationStates.USERS:
        return this.props.associationState.userEmailAssociation.length === 0 ? incorrectFields.push('error') : [];
      default:
        return [];
    }
    return incorrectFields;
  };

  render() {
    const { jiraIssueTypes, jiraStatusTypes, jiraUsers } = this.props.associationState;
    const { taskTypes, taskStatuses, simtrackProjectUsers, lang } = this.props;
    let JiraTableBody;
    let SimtrackTableBody;
    const hasErrors = !(this.getFormErrors().length === 0);
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
        if (jiraUsers && simtrackProjectUsers) {
          JiraTableBody = jiraUsers.map(entity => {
            return this.renderJiraRow(entity);
          });
          SimtrackTableBody = simtrackProjectUsers.map(entity => {
            return this.renderSimtrackRow(entity);
          });
        }
        break;
      default:
        break;
    }

    const nextButtonFunction = this.stepsManager[this.state.currentStep].forwardStep
      ? () => this.nextAssociationStep()
      : () => this.props.nextStep();

    const backButtonFunction = this.stepsManager[this.state.currentStep].backwardStep
      ? () => this.previousAssociationStep()
      : () => this.props.previousStep();

    return (
      <div className={css.mainContainer}>
        <label className={css.formField}>
          <Row>
            <div className={css.innerFirstCol}>
              <Col xs={12}>
                <table className={css.usersRolesTable}>
                  <thead>
                    <tr className={css.usersRolesHeader}>
                      <th />
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
            <div className={css.innerFirstCol}>
              <Col xs={12}>
                <table className={cn(css.usersRolesTable, css.simtrackTable)}>
                  <thead>
                    <tr className={css.usersRolesHeader}>
                      {this.state.currentStep === associationStates.ISSUE_TYPES ? (
                        <th>{localize[lang].SIMTRACK_ISSUE_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.STATUS_TYPES ? (
                        <th colSpan={2}>{localize[lang].SIMTRACK_STATUS_TYPES}</th>
                      ) : null}
                      {this.state.currentStep === associationStates.USERS ? (
                        <th colSpan={2}>{localize[lang].SIMTRACK_USER}</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>{SimtrackTableBody}</tbody>
                </table>
              </Col>
            </div>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          <Button text={localize[lang].GO_BACK} onClick={() => backButtonFunction()} type="green" />
          <Button
            disabled={hasErrors}
            text={localize[lang].GO_AHEAD}
            onClick={() => nextButtonFunction()}
            type="green"
          />
        </div>
      </div>
    );
  }
}

export default SetAssociationForm;
