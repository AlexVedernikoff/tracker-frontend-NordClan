import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './CreateProject.json';
import * as css from './CreateProject.scss';

import Input from '../../../Input';
import Button from '../../../Button';
import SelectDropdown from '../../../SelectDropdown';

class CreateProjectForm extends Component {
  static propTypes = {
    authorId: PropTypes.string,
    getJiraProjects: PropTypes.func,
    jiraProjects: PropTypes.array,
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    token: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      authorId: this.props.authorId,
      jiraProjectId: '',
      prefix: ''
    };
  }

  componentDidMount() {
    this.props.getJiraProjects({ 'X-Jira-Auth': this.props.token });
  }

  onChange = (name, e) => {
    this.setState({
      [name]: e ? e.value : ''
    });
  };

  onChangePrefix = (name, e) => {
    this.setState({
      [name]: e.target.value
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
          <p>{localize[lang].CREATE_PROJECT}</p>
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
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].PREFIX}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].PREFIX}
                onChange={e => this.onChangePrefix('prefix', e)}
                value={this.state.prefix}
              />
            </Col>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          <Button text="Назад" onClick={() => previousStep(this.state)} type="green" />
          <Button
            text="Вперед"
            onClick={() => nextStep({ 'X-Jira-Auth': this.props.token }, this.state)}
            type="green"
          />
        </div>
      </div>
    );
  }
}

export default CreateProjectForm;
