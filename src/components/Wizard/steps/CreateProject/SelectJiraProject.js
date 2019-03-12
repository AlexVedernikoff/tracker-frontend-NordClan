import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './SelectJiraProject.json';
import * as css from './SelectJiraProject.scss';

import Button from '../../../Button';
import SelectDropdown from '../../../SelectDropdown';

class CreateProjectForm extends Component {
  static propTypes = {
    authDataStep: PropTypes.object,
    getJiraProjects: PropTypes.func,
    jiraProjects: PropTypes.array,
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    saveJiraServerInfo: PropTypes.func,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      jiraProjectId: '',
      jiraProjectAlreadyLinked: null
    };
  }

  componentDidMount() {
    this.props.getJiraProjects({ 'X-Jira-Auth': this.props.token });
  }

  onChange = (name, e) => {
    const currentProject = this.props.jiraProjects.find(project => e.value === project.id);
    const linkedProjectId = currentProject ? currentProject.linkedProject : null;
    this.setState({
      [name]: e ? e.value : '',
      jiraProjectAlreadyLinked: linkedProjectId
    });
  };

  getJiraProjects = () => {
    if (this.props.jiraProjects) {
      return this.props.jiraProjects.map(ns => ({
        value: ns.id,
        label: ns.name
      }));
    }
  };

  render() {
    const { lang, previousStep, nextStep } = this.props;
    const formLayout = {
      firstCol: 3,
      secondCol: 9
    };
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{localize[lang].SELECT_JIRA_PROJECT}</p>
        </h3>
        <hr />
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].JIRA_PROJECT}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <SelectDropdown
                name="jira_project"
                placeholder={localize[lang].JIRA_PROJECT}
                multi={false}
                value={this.state.jiraProjectId}
                onChange={e => this.onChange('jiraProjectId', e)}
                options={this.getJiraProjects()}
                autofocus
              />
              {this.state.jiraProjectAlreadyLinked && (
                <div className={css.jiraCaptchaLink}>{localize[lang].JIRA_PROJECT_IS_ALREADY_USE}</div>
              )}
            </Col>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          <Button text="Назад" onClick={() => previousStep(this.state)} type="green" />
          <Button
            text="Вперед"
            disabled={!this.state.jiraProjectId}
            onClick={() => nextStep(this.state)}
            type="green"
          />
        </div>
      </div>
    );
  }
}

export default CreateProjectForm;
