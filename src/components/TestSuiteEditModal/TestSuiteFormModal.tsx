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
import Description from '../../components/Description';

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
  constructor(props) {
    super(props);
    this.state = { title: props.title, description: props.description, isEditing: false };
    this.validator = new Validator();
  }

  resetState = () => {
    this.setState({
      title: this.props.title,
      description: this.props.description,
      isEditing: false
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
    onFinish(title, description, modalId);
    this.setState({ title: '', description: '' });
  };

  onChange = label => event => {
    this.setState({ [label]: event.target.value });
  };

  onEditStart = () => {
    this.setState({ isEditing: true });
  };

  onEditFinish = editorState => {
    this.setState({
      isEditing: false,
      description: editorState.description.trim()
    });
  };

  render() {
    const { lang, isLoading, isCreating, isOpen, modalId } = this.props;
    const { title, description, isEditing } = this.state;
    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };
    const isTitleValid = this.isTitleValid();
    return (
      <Modal isOpen={isOpen} contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div className={css.container} key={modalId || 0} >
          <Callback callback={this.resetState} />
          <h3>{isCreating === false ? localize[lang].EDIT_HEADER : localize[lang].CREATE_HEADER}</h3>
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
                {false && (
                  <TextareaAutosize
                    className={css.textarea}
                    onChange={this.onChange('description')}
                    placeholder={localize[lang].ENTER_DESCRIPTION}
                    value={description}
                  />
                )}
                <Description
                  className={css.textarea}
                  text={{ __html: description }}
                  headerType="h4"
                  id={0}
                  headerText={localize[lang].ENTER_DESCRIPTION}
                  onEditStart={this.onEditStart}
                  onEditFinish={() => {}}
                  onEditSubmit={editorState => {
                    this.onEditFinish(editorState);
                  }}
                  isEditing={isEditing}
                  canEdit
                  clickAnywhereToEdit={false}
                  placeholder={localize[lang].PRE_CONDITIONS_PLACEHOLDER}
                />
              </Col>
            </Row>
          </label>
          <Row className={css.buttons}>
            <Button
              text="OK"
              type="green"
              htmlType="submit"
              disabled={!isTitleValid || isLoading || isEditing}
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
