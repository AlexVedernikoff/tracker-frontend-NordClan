import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import { createTestSuite, updateTestSuite } from '../../actions/TestSuite';
import Button from '../Button';
import Modal from '../Modal';
import ValidatedInput from '../ValidatedInput';
import Validator from '../ValidatedInput/Validator';
import localize from './TestSuiteFormModal.json';
import * as css from './TestSuiteFormModal.scss';

class TestSuiteFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { title: props.title, description: props.description };
    this.validator = new Validator();
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ title: undefined, description: undefined });
    onClose();
  };

  onSubmit = () => {
    const { id, create, update } = this.props;
    if (!id) {
      create(this.state).then(() => this.onClose());
    } else {
      update(id, this.state).then(() => this.onClose());
    }
  };

  onChange = label => event => {
    this.state({ [label]: event.target.value });
  };

  render() {
    const { lang, isLoading, id } = this.props;
    const { title, description } = this.state;
    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };
    const isTitleValid = title.length > 0 && title.length <= 255;
    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div className={css.container}>
          <h3>{id ? localize[lang].HEADER_EDIT : localize[lang].HEADER_CREATE}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].TITLE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      placeholder={localize[lang].TITLE}
                      label="title"
                      onChange={this.onChange('title')}
                      value={title}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={localize[lang].FIELD_IS_NOT_FILLED}
                    />
                  ),
                  'title',
                  !isTitleValid
                )}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].DESCRIPTION}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <TextareaAutosize
                  className={css.textarea}
                  onChange={this.onChange('description')}
                  placeholder={localize[lang].ENTER_DESCRIPTION}
                  value={description}
                />
              </Col>
            </Row>
          </label>
          <Row className={css.buttons}>
            <Button
              text="OK"
              type="green"
              htmlType="submit"
              disabled={!isTitleValid && isLoading}
              onClick={this.onSubmit}
              loading={isLoading}
            />
          </Row>
        </div>
      </Modal>
    );
  }
}

TestSuiteFormModal.propTypes = {
  create: PropTypes.func.isRequired,
  description: PropTypes.string,
  id: PropTypes.number,
  isLoading: PropTypes.boolisRequired,
  lang: PropTypes.stringisRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  update: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading
});

const mapDispatchToProps = { update: updateTestSuite, create: createTestSuite };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestSuiteFormModal);
