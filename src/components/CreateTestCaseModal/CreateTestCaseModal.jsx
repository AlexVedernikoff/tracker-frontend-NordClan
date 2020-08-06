import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import Select from 'react-select';
import * as TestCaseActions from '../../actions/TestCase';
import { getOptionsFrom } from '../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../selectors/dictionaries';
import { testSuitesOptionsSelector } from '../../selectors/testingCaseReference';
import Button from '../Button';
import { IconDelete, IconPlus } from '../Icons';
import Modal from '../Modal';
import Priority from '../Priority';
import SelectCreatable from '../SelectCreatable';
import TestSuiteFormModal from '../TestSuiteEditModal';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import Validator from '../ValidatedInput/Validator';
import ValidatedTextEditor from '../ValidatedTextEditor';
import { RULES } from './constants';
import localize from './CreateTestCaseModal.json';
import * as css from './CreateTestCaseModal.scss';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
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
        .second(0),
      testSuite: null,
      authorId: props.authorId,
      isCreatingSuite: false,
      newTestSuiteTitle: ''
    };
    this.state = this.initialState;
    this.validator = new Validator();
  }

  componentDidMount() {
    const { testSuites, getAllTestCases } = this.props;
    testSuites.length === 1 && getAllTestCases();
  }

  setInitialState = () => {
    this.setState(this.initialState);
  };

  handleStepsCollapse = () => {
    this.setState(state => {
      return { isStepsOpen: !state.isStepsOpen };
    });
  };

  handleTestSuiteForm = () => this.setState({ isCreatingSuite: !this.state.isCreatingSuite });
  onCreatingTestSuite = option => {
    this.setState({ newTestSuiteTitle: option.label }, () => this.handleTestSuiteForm());
  };

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
    this.setState({ [field]: editorState.getCurrentContent().getPlainText() });
  };

  onAddStep = () => {
    this.setState({ steps: [...this.state.steps, { action: '', expectedResult: '' }] });
  };

  onDeleteStep = i => () => {
    this.setState({ steps: this.state.steps.filter((step, j) => i !== j) });
  };

  handleStepChange = (i, field) => editorState => {
    this.setState(state => {
      const steps = state.steps.map((item, j) => {
        if (j === i) {
          return { ...item, [field]: editorState.getCurrentContent().getPlainText() };
        } else {
          return item;
        }
      });

      return {
        steps
      };
    });
  };

  submitTestCase = event => {
    const { createTestCase, onClose } = this.props;
    event.preventDefault();
    createTestCase({
      ...this.state,
      duration: this.state.duration.format('HH:mm:ss'),
      severityId: this.state.severity.value,
      statusId: this.state.status.value,
      testSuiteId: Number.isInteger(this.state.testSuite.value) ? this.state.testSuite.value : null
    }).then(() => {
      this.setInitialState();
      onClose();
    });
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
    const { onClose, closeTimeoutMS, isOpen, lang, statuses, severities, isLoading, testSuites, ...other } = this.props;
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
    const isStepsFilled = steps.every(stepItem => stepItem.action && stepItem.expectedResult);
    const titleValidation = title.length < RULES.MIN_TITLE_LENGTH || title.length > RULES.MAX_TITLE_LENGTH;
    const shouldButtonsBeEnabled = !isLoading && !titleValidation && isStepsFilled;
    return (
      <Modal {...other} isOpen={isOpen} onRequestClose={onClose} closeTimeoutMS={200 || closeTimeoutMS}>
        <form className={css.container}>
          <h3>{localize[lang].FORM_TITLE}</h3>
          <hr />
          <label className={classnames(css.field, css.titleField)}>
            <Row>
              <Col xs={12} sm={12} className={css.label}>
                <p>{localize[lang].TITLE_LABEL} </p>
              </Col>
              <Col xs={12} sm={12} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      maxRows={5}
                      autoFocus
                      name="title"
                      placeholder={localize[lang].TITLE_PLACEHOLDER}
                      onChange={this.handleChange('title')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('title')}
                    />
                  ),
                  'title',
                  titleValidation
                )}
              </Col>
            </Row>
          </label>
          <Row>
            <Col xs={8} sm={8}>
              <label className={css.field}>
                <Row>
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].PRE_CONDITIONS_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
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
              <label className={classnames(css.field)}>
                <Row>
                  <Col
                    xs={12}
                    sm={12}
                    className={classnames(css.label, css.stepsLabel)}
                    onClick={this.handleStepsCollapse}
                  >
                    <p>{localize[lang].STEPS_LABEL}</p>
                  </Col>
                  {steps.map((step, i) => (
                    <Col xs={12} sm={12} key={i} className={css.step}>
                      <Row>
                        <Col xs={1} sm={1} className={css.stepLabel}>
                          <p>#{i}</p>
                        </Col>
                        <Col xs={5} sm={5} className={css.fieldInput}>
                          {this.validator.validate(
                            (handleBlur, shouldMarkError) => (
                              <ValidatedTextEditor
                                toolbarHidden
                                onEditorStateChange={this.handleStepChange(i, 'action')}
                                placeholder={localize[lang].STEPS_ACTION_PLACEHOLDER}
                                wrapperClassName={css.textEditorWrapper}
                                editorClassName={classnames(css.text, css.textStep)}
                                onBlur={handleBlur}
                                content={step.action}
                                shouldMarkError={shouldMarkError}
                                errorText={this.getFieldError('text')}
                              />
                            ),
                            'stepAction' + i,
                            step.action.length > RULES.MAX_TEXT_LENGTH
                          )}
                        </Col>
                        <Col xs={5} sm={5} className={css.fieldInput}>
                          {this.validator.validate(
                            (handleBlur, shouldMarkError) => (
                              <ValidatedTextEditor
                                toolbarHidden
                                onEditorStateChange={this.handleStepChange(i, 'expectedResult')}
                                placeholder={localize[lang].STEPS_EXPECTED_RESULT_PLACEHOLDER}
                                wrapperClassName={css.textEditorWrapper}
                                editorClassName={classnames(css.text, css.textStep)}
                                onBlur={handleBlur}
                                content={step.expectedResult}
                                shouldMarkError={shouldMarkError}
                                errorText={this.getFieldError('text')}
                              />
                            ),
                            'stepExpectedResult' + moment().toISOString,
                            step.expectedResult.length > RULES.MAX_TEXT_LENGTH
                          )}
                        </Col>
                        <Col xs={1} sm={1} className={classnames(css.fieldInput, css.stepDeleteContainer)}>
                          {steps.length > 1 && (
                            <IconDelete className={css.stepDeleteIcon} onClick={this.onDeleteStep(i)} />
                          )}
                        </Col>
                      </Row>
                    </Col>
                  ))}
                  <Col xs={12} sm={12}>
                    <Row center="xs" className={css.addStepRow}>
                      <Col xs={12} sm={12} className={css.addStepContainer} onClick={this.onAddStep}>
                        <IconPlus className={css.addStepIcon} icon="IconPlus" />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </label>
              <label className={css.field}>
                <Row>
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].POST_CONDITIONS_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
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
            </Col>
            <Col xs={4} sm={4}>
              <label className={css.field}>
                <Row>
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].DESCRIPTION_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
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
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].STATUS_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
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
                  <Col xs={12} sm={12} className={css.label}>
                    <p>{localize[lang].SEVERITY_LABEL}</p>
                  </Col>
                  <Col xs={12} sm={12} className={css.fieldInput}>
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
              <Row className={css.twoFields}>
                <Col xs={6} sm={6}>
                  <label className={css.field}>
                    <Row>
                      <Col xs={12} sm={12} className={css.label}>
                        <p>{localize[lang].PRIORITY_LABEL}</p>
                      </Col>
                      <Col xs={12} sm={12} className={classnames(css.rightColumn)}>
                        <Priority priority={priority} onPrioritySet={this.handlePriorityChange} text={''} />
                      </Col>
                    </Row>
                  </label>
                </Col>
                <Col xs={6} sm={6}>
                  <label className={css.field}>
                    <Row>
                      <Col xs={12} sm={12} className={css.label}>
                        <p>{localize[lang].DURATION_LABEL}</p>
                      </Col>
                      <Col xs={12} sm={12} className={css.fieldInput}>
                        <TimePicker defaultValue={duration} allowEmpty={false} onChange={this.handleDurationChange} />
                      </Col>
                    </Row>
                  </label>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={css.buttons}>
            <Button
              text={localize[lang].CREATE_TEST_CASE}
              type="green"
              htmlType="submit"
              disabled={!shouldButtonsBeEnabled}
              onClick={this.submitTestCase}
              loading={isLoading}
            />
            <Button
              text={localize[lang].CREATE_OPEN_TEST_CASE}
              htmlType="button"
              type="green-lighten"
              disabled={!shouldButtonsBeEnabled}
              onClick={this.submitTestCase}
              loading={isLoading}
            />
          </Row>
        </form>
      </Modal>
    ) : (
      <TestSuiteFormModal title={newTestSuiteTitle} onClose={this.handleTestSuiteForm} />
    );
  }
}

CreateTestCaseModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  createTestCase: PropTypes.func,
  getAllTestCases: PropTypes.func,
  isOpen: PropTypes.bool,
  lang: PropTypes.string,
  onClose: PropTypes.func,
  severities: PropTypes.array,
  statuses: PropTypes.array,
  testSuiteId: PropTypes.number,
  userId: PropTypes.number
};

CreateTestCaseModal.defaultProps = {
  isOpen: true,
  lang: 'en',
  onClose: () => console.log('closed')
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  statuses: getOptionsFrom(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  testSuites: testSuitesOptionsSelector(state),
  authorId: state.Auth.user.id,
  isLoading: !!state.Loading.loading
});

const mapDispatchToProps = {
  createTestCase: TestCaseActions.createTestCase,
  getAllTestCases: TestCaseActions.getAllTestCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
