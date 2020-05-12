import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { stateToHTML } from 'draft-js-export-html';
import Select from 'react-select';

import Modal from '../../components/Modal';
import Validator from '../../components/ValidatedInput/Validator';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import ValidatedTextEditor from '../ValidatedTextEditor';
import Priority from '../Priority';

import * as css from './CreateTestCaseModal.scss';
import localize from './CreateTestCaseModal.json';
import rules from './constants';
import { TEST_CASE_STATUSES } from '../../constants/TestCaseStatuses';
import { TEST_CASE_SEVERITIES } from '../../constants/TestCaseSeverities';
import { getLocalizedTestCaseStatuses, getLocalizedTestCaseSeverities } from './devMocks';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      status: TEST_CASE_STATUSES.ACTUAL,
      severity: TEST_CASE_SEVERITIES.NOT_SET,
      priority: 3,
      preConditions: '',
      postConditions: '',
      steps: [{ action: '', expectedResult: '' }]
    };
    this.validator = new Validator();
  }

  handleChange = field => event => {
    const value = Number.isInteger(event.target.value) ? +event.target.value : event.target.value.trim();
    this.setState({ [field]: value });
  };

  handleTextEditorChange = field => editorState => {
    this.setState({ [field]: stateToHTML(editorState.getCurrentContent()) });
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
        return title > rules.MIN_TITLE_LENGTH
          ? localize[lang].TITLE_ERROR.TOO_LONG
          : localize[lang].TITLE_ERROR.TOO_SHORT;
      case 'description':
        return localize[lang].TEXT_ERROR_TOO_LONG;
      default:
        return '';
    }
  };

  getEnumFromTypes = {};

  render() {
    const { onCancel, closeTimeoutMS, isOpen, lang, statuses, severities, ...other } = this.props;
    const { title, description, status, priority, severity, preConditions, postConditions } = this.state;

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
                  title.length < rules.MIN_TITLE_LENGTH || title.length > rules.MAX_TITLE_LENGTH
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
                      errorText={this.getFieldError('description')}
                    />
                  ),
                  'description',
                  description.length > rules.MAX_TEXT_LENGTH
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
                  onChange={this.handleChange('status')}
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
                  onChange={this.handleChange('severity')}
                  isClearable={false}
                  isRtl={false}
                />
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
                      errorText={this.getFieldError('preConditions')}
                    />
                  ),
                  'preConditions',
                  preConditions.length > rules.MAX_TEXT_LENGTH
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
                  postConditions.length > rules.MAX_TEXT_LENGTH
                )}
              </Col>
            </Row>
          </label>
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
  statuses: PropTypes.array
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
  statuses: dictionaryTypesToOptions(getLocalizedTestCaseStatuses(state)),
  severities: dictionaryTypesToOptions(getLocalizedTestCaseSeverities(state))
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
