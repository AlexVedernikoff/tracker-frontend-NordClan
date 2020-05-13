import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { stateToHTML } from 'draft-js-export-html';
import Select from 'react-select';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import Modal from '../../components/Modal';
import Validator from '../../components/ValidatedInput/Validator';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import ValidatedTextEditor from '../ValidatedTextEditor';
import Priority from '../Priority';
import Button from '../Button';

import * as css from './CreateTestCaseModal.scss';
import localize from './CreateTestCaseModal.json';
import { RULES } from './constants';
import { getLocalizedTestCaseStasuses, getLocalizedTestCaseSeverities } from './devMocks';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      status: props.statuses[2],
      severity: props.severities[0],
      priority: 3,
      preConditions: '',
      postConditions: '',
      steps: [{ action: '', expectedResult: '' }],
      duration: moment()
        .hour(0)
        .minute(10)
        .second(0)
    };
    this.validator = new Validator();
  }

  handleChange = field => event => {
    const value = Number.isInteger(event.target.value) ? +event.target.value : event.target.value.trim();
    this.setState({ [field]: value });
  };

  handleSelect = field => value => {
    this.setState({ [field]: value });
  };

  handlePriorityChange = priorityId => this.setState({ priority: +priorityId });

  handleDurationChange = duration => {
    this.setState({ duration });
  };

  handleTextEditorChange = field => editorState => {
    this.setState({ [field]: stateToHTML(editorState.getCurrentContent()) });
  };

  onLastStepFocus = () => {
    this.setState(state => {
      const steps = [...state.steps, { action: '', expectedResult: '' }];
      return { steps };
    });
  };

  handleStepChange = (i, field) => editorState => {
    this.setState(state => {
      const steps = state.steps.map((item, j) => {
        if (j === i) {
          return { ...item, [field]: stateToHTML(editorState.getCurrentContent()) };
        } else {
          return item;
        }
      });

      return {
        steps
      };
    });
  };

  validateAndSubmit = event => {
    event.preventDefault();
    console.log('validated');
  };

  getFieldError = fieldName => {
    const { lang } = this.props;
    switch (fieldName) {
      case 'title':
        const { title } = this.state;
        return title > RULES.MIN_TITLE_LENGTH
          ? localize[lang].TITLE_ERROR.TOO_LONG
          : localize[lang].TITLE_ERROR.TOO_SHORT;
      case 'text':
        return localize[lang].TEXT_ERROR_TOO_LONG;
      default:
        return '';
    }
  };

  render() {
    const { onCancel, closeTimeoutMS, isOpen, lang, statuses, severities, ...other } = this.props;
    const {
      title,
      description,
      status,
      priority,
      severity,
      preConditions,
      postConditions,
      steps,
      duration
    } = this.state;

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    return (
      <Modal {...other} isOpen={isOpen} onRequestClose={onCancel} closeTimeoutMS={200 || closeTimeoutMS}>
        <form className={css.container}>
          <h3>{localize[lang].FORM_TITLE}</h3>
          <hr />
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].TITLE_LABEL} </p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      maxRows={5}
                      autoFocus
                      name="title"
                      placeholder={localize[lang].TITLE_PLACEHOLDER}
                      onChange={this.handleChange('title')}
                      onBlur={handleBlur}
                      onSubmit={this.validateAndSubmit}
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('title')}
                    />
                  ),
                  'title',
                  title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH
                )}
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].DESCRIPTION_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={this.handleTextEditorChange('description')}
                      placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={''}
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('text')}
                    />
                  ),
                  'description',
                  description.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].STATUS_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                <Select
                  isSearchable={false}
                  options={statuses}
                  className={css.select}
                  value={status}
                  onChange={this.handleSelect('status')}
                  isClearable={false}
                  isRtl={false}
                />
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].SEVERITY_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                <Select
                  isSearchable={false}
                  options={severities}
                  className={css.select}
                  value={severity}
                  onChange={this.handleSelect('severity')}
                  isClearable={false}
                  isRtl={false}
                />
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].DURATION_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                <TimePicker defaultValue={duration} allowEmpty={false} onChange={this.handleDurationChange} />
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].PRIORITY_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={classnames(css.rightColumn, css.priority)}>
                <Priority priority={priority} onPrioritySet={this.handlePriorityChange} text={''} />
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].PRE_CONDITIONS_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={this.handleTextEditorChange('preConditions')}
                      placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={''}
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('text')}
                    />
                  ),
                  'preConditions',
                  preConditions.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                <p>{localize[lang].POST_CONDITIONS_LABEL}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedTextEditor
                      toolbarHidden
                      onEditorStateChange={this.handleTextEditorChange('postConditions')}
                      placeholder={localize[lang].POST_CONDITIONS_PLACEHOLDER}
                      wrapperClassName={css.textEditorWrapper}
                      editorClassName={css.text}
                      onBlur={handleBlur}
                      content={''}
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('postConditions')}
                    />
                  ),
                  'postConditions',
                  postConditions.length > RULES.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
          <label className={css.field}>
            <Row>
              <Col xs={24} sm={formLayout.firstCol} className={classnames(css.label, css.stepsLabel)}>
                <p>{localize[lang].STEPS_LABEL}</p>
              </Col>
              {steps.map((step, i) => (
                <div className={classnames(css.container, css.step)} key={i}>
                  <label className={css.field}>
                    <Row>
                      <Col xs={12} sm={formLayout.firstCol} className={classnames(css.label, css.stepLabel)}>
                        <p>
                          {localize[lang].STEPS_ACTION_LABEL} #{i + 1}
                        </p>
                      </Col>
                      <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                        {this.validator.validate(
                          (handleBlur, shouldMarkError) => (
                            <ValidatedTextEditor
                              toolbarHidden
                              onEditorStateChange={this.handleStepChange(i, 'action')}
                              placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                              wrapperClassName={css.textEditorWrapper}
                              editorClassName={css.text}
                              onBlur={handleBlur}
                              content={step.action}
                              onFocus={i === steps.length - 1 ? this.onLastStepFocus : () => {}}
                              shouldMarkError={shouldMarkError}
                              errorText={this.getFieldError('text')}
                            />
                          ),
                          'stepAction' + i,
                          step.action.length > RULES.MAX_TEXT_LENGTH
                        )}
                      </Col>
                    </Row>
                  </label>
                  <label className={css.field}>
                    <Row>
                      <Col xs={12} sm={formLayout.firstCol} className={css.label}>
                        <p>
                          {localize[lang].STEPS_EXPECTED_RESULT_LABEL} #{i + 1}
                        </p>
                      </Col>
                      <Col xs={12} sm={formLayout.secondCol} className={css.fieldInput}>
                        {this.validator.validate(
                          (handleBlur, shouldMarkError) => (
                            <ValidatedTextEditor
                              toolbarHidden
                              onEditorStateChange={this.handleStepChange(i, 'expectedResult')}
                              placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                              wrapperClassName={css.textEditorWrapper}
                              editorClassName={css.text}
                              onBlur={handleBlur}
                              onFocus={i === steps.length - 1 ? this.onLastStepFocus : () => {}}
                              content={step.expectedResult}
                              shouldMarkError={shouldMarkError}
                              errorText={this.getFieldError('text')}
                            />
                          ),
                          'stepExpectedResult' + moment().toISOString,
                          step.expectedResult.length > RULES.MAX_TEXT_LENGTH
                        )}
                      </Col>
                    </Row>
                  </label>
                </div>
              ))}
            </Row>
          </label>
          <div className={css.buttons}>
            <Button
              text={localize[lang].CREATE_TEST_CASE}
              type="green"
              htmlType="submit"
              disabled
              onClick={() => {}}
              loading={() => {}}
            />
            <Button
              text={localize[lang].CREATE_OPEN_TEST_CASE}
              htmlType="button"
              type="green-lighten"
              disabled
              onClick={() => {}}
              loading={() => {}}
            />
          </div>
        </form>
      </Modal>
    );
  }
}

CreateTestCaseModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  isOpen: PropTypes.bool,
  lang: PropTypes.string,
  onCancel: PropTypes.func,
  severities: PropTypes.array,
  statuses: PropTypes.array,
  testSuiteId: PropTypes.number,
  userId: PropTypes.number
};

CreateTestCaseModal.defaultProps = {
  isOpen: true,
  lang: 'en',
  onCancel: () => console.log('canceled')
};

const dictionaryTypesToOptions = dictionary =>
  dictionary.map(({ name, id }) => ({
    label: name,
    value: id
  }));

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  statuses: dictionaryTypesToOptions(getLocalizedTestCaseStasuses(state)),
  severities: dictionaryTypesToOptions(getLocalizedTestCaseSeverities(state)),
  userId: state.Auth.user.id
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
