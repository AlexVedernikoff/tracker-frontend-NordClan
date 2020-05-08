import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { stateToHTML } from 'draft-js-export-html';

import Modal from '../../components/Modal';
import Validator from '../../components/ValidatedInput/Validator';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';
import ValidatedTextEditor from '../ValidatedTextEditor';

import * as css from './CreateTestCaseModal.scss';
import localize from './CreateTestCaseModal.json';
import rules from './constants';
import { TEST_TASK_STATUSES } from '../../constants/TestTaskStatus';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      priority: 3,
      preConditions: '',
      postConditions: '',
      status: TEST_TASK_STATUSES.ACTUAL,
      steps: [{ action: '', expectedResult: '' }]
    };
    this.validator = new Validator();
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value.trim() });
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

  render() {
    const { onCancel, closeTimeoutMS, isOpen, lang, ...other } = this.props;
    const { title, description } = this.state;

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
                      wrapperClassName={css.descriptionWrapper}
                      editorClassName={css.description}
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
        </form>
      </Modal>
    );
  }
}

CreateTestCaseModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  isOpen: PropTypes.bool,
  lang: PropTypes.string,
  onCancel: PropTypes.func
};

CreateTestCaseModal.defaultProps = {
  isOpen: true,
  lang: 'en',
  onCancel: () => console.log('canceled')
};

const mapStateToProps = state => ({ lang: state.Localize.lang });

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
