import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { Col, Row } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import Modal from '../Modal';
import ValidatedInput from '../ValidatedInput';
import Validator from '../ValidatedInput/Validator';
import localize from './TestSuiteFormModal.json';
import * as css from './TestSuiteFormModal.scss';
import ValidatedAutosizeInput from '../../components/ValidatedAutosizeInput'

class Callback extends Component<any, any> {
  componentDidMount() {
    const props = this.props;
    props.callback();
  }

  render () {
    return null;
  }
}

class TestSuiteFormModal extends Component<any, any> {
  validator: Validator;

  constructor(props) {
    super(props);
    this.state = { title: props.title, description: props.description };
    this.validator = new Validator();
  }

  resetState = () => {
    this.setState({
      title: this.props.title,
      description: this.props.description,
    });
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ title: '', description: '' });
    onClose();
  };

  isTitleValid = () => {
    const { title } = this.state;
    return title.trim().length > 0 && title.trim().length <= 255;
  };

  onSubmit = () => {
    if (!this.isTitleValid()) return;

    const { onFinish, modalId } = this.props;
    const { title, description } = this.state;
    onFinish(title, description, modalId).then(() => this.setState({ title: '', description: '' }));
  };

  onChange = label => event => {
    this.setState({ [label]: event.target.value });
  };

  render() {
    const { lang, isLoading, isOpen, modalId, isCreating } = this.props;
    const { title, description } = this.state;
    const isTitleValid = this.isTitleValid();

    return (
      <Modal isOpen={isOpen} contentLabel="modal" onRequestClose={this.onClose}>
        <div className={css.container} key={modalId || 0} >
          <Callback callback={this.resetState} />
          <h3>{isCreating === false ? localize[lang].EDIT_HEADER : localize[lang].CREATE_HEADER}</h3>
          <hr />
          <label>
            <Row>
              <Col xs={12} sm={2} className={css.label}>
                <p>{localize[lang].TITLE} </p>
              </Col>
              <Col xs={12} sm={10} className={css.fieldInput}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedAutosizeInput
                      autoFocus
                      maxRows={2}
                      name="title"
                      value={title}
                      placeholder={localize[lang].TITLE_PLACEHOLDER}
                      onChange={this.onChange('title')}
                      onBlur={handleBlur}
                      shouldMarkError={shouldMarkError}
                      errorText={title.length === 0
                        ? localize[lang].TITLE_ERROR.EMPTY
                        : title.length > 255
                          ? localize[lang].TITLE_ERROR.TOO_MUCH
                          : ''}
                    />
                  ),
                  'title',
                  !isTitleValid
                )}
              </Col>
            </Row>
          </label>
          <label>
            <Row>
              <Col xs={12} sm={2} className={css.label}>
                <p>{localize[lang].DESCRIPTION} </p>
              </Col>
              <Col xs={12} sm={10} className={css.fieldInput}>
                <ValidatedAutosizeInput
                  rows={3}
                  maxRows={5}
                  name="description"
                  value={description}
                  placeholder={localize[lang].DESCRIPTION_PLACEHOLDER}
                  onChange={this.onChange('description')}
                  onBlur={() => null}
                />
              </Col>
            </Row>
          </label>
          <Row className={css.buttons}>
            <Button
              text="OK"
              type="green"
              htmlType="submit"
              disabled={!isTitleValid || isLoading}
              onClick={this.onSubmit}
              loading={isLoading}
            />
          </Row>
        </div>
      </Modal>
    );
  }
}

(TestSuiteFormModal as any).propTypes = {
  description: PropTypes.string,
  isCreating: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  modalId: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default TestSuiteFormModal;
