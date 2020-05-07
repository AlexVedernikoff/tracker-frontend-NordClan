import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateTestCaseModal.scss';
import localize from './CreateTestCaseModal.json';
import rules from './constants';
import Modal from '../../components/Modal';
import Validator from '../../components/ValidatedInput/Validator';
import ValidatedAutosizeInput from '../ValidatedAutosizeInput';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
    this.validator = new Validator();
    this.fieldNames = Object.keys(this.state);
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value.trim() });
  };

  getFieldError = fieldName => {
    const { lang } = this.props;
    switch (fieldName) {
      case this.fieldNames.title:
        const { title } = this.state;
        return title > rules.MIN_TITLE_LENGTH
          ? localize[lang].TITLE_ERROR.TOO_LONG
          : localize[lang].TITLE_ERROR.TOO_SHORT;
      default:
        return '';
    }
  };

  render() {
    const { onCancel, closeTimeoutMS, lang, ...other } = this.props;
    const { title } = this.state;

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    return (
      <Modal {...other} onRequestClose={onCancel} closeTimeoutMS={200 || closeTimeoutMS}>
        <form className={css.container}>
          <h3>{localize[lang].FORM_TITLE}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].TITLE} </p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      maxRows={5}
                      autoFocus
                      name={this.fieldNames.title}
                      placeholder={localize[lang].TITLE_PLACEHOLDER}
                      onChange={this.handleChange(this.fieldNames.title)}
                      onBlur={handleBlur}
                      onEnter={this.validateAndSubmit}
                      shouldMarkError={shouldMarkError}
                      errorText={this.generateError(this.fieldNames.title)}
                    />
                  ),
                  this.fieldNames.title,
                  title.length < rules.MIN_TITLE_LENGTH || title.length > rules.MAX_TITLE_LENGTH
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
  onCancel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ lang: state.Localize.lang });

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
