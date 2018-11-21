import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import Select from '../SelectDropdown';
import * as css from './MissingProjectFieldsModal.scss';
import { getErrorMessageByType } from '../../utils/ErrorMessages';
import localize from './MissingProjectFieldsModal.json';

class MissingProjectFieldsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: '',
      typeId: 1,
      error: null
    };
    this.validator = new Validator();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error) {
      this.setState({ error: newProps.error });
    }
  }

  getFieldError = fieldName => {
    const errorsArr = this.props.error
      ? this.props.error.message.errors.filter(error => error.param === fieldName)
      : [];

    if (errorsArr.length) {
      return getErrorMessageByType(errorsArr[0].type);
    }

    return null;
  };

  onPrefixInputChange = e => {
    this.setState({ prefix: e.target.value, error: null });
  };

  onTypeChange = option => {
    const typeId = option ? option.value : 1;
    this.setState({ typeId });
  };

  onConfirm = () => {
    const { typeId, prefix } = this.state;
    const values = { typeId, prefix };
    this.props.onConfirm(values);
  };

  render() {
    const { closeTimeoutMS, text, onCancel, projectTypes, lang, ...other } = this.props;
    const { error, typeId, prefix } = this.state;
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    const options = projectTypes.map(type => ({ value: type.id, label: localize[lang][type.codename] }));
    return (
      <Modal {...other} onRequestClose={onCancel} closeTimeoutMS={200 || closeTimeoutMS}>
        <div className={css.container}>
          <h3 style={{ margin: 0 }}>{text}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].PROJECT_PREFIX}:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      placeholder={localize[lang].PROJECT_PREFIX}
                      onChange={this.onPrefixInputChange}
                      onBlur={handleBlur}
                      name="prefix"
                      shouldMarkError={shouldMarkError}
                      errorText={this.getFieldError('prefix')}
                    />
                  ),
                  'prefix',
                  error
                )}
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].PROJECT_TYPE}:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  name="performer"
                  placeholder={localize[lang].CHOOSE_PROJECT_TYPE}
                  multi={false}
                  noResultsText={localize[lang].NO_RESULTS}
                  backspaceRemoves={false}
                  options={options}
                  className={css.selectType}
                  onChange={this.onTypeChange}
                  value={typeId}
                />
              </Col>
            </Row>
          </label>
          <div className={css.footer}>
            <Button
              text="ОК"
              type="green"
              style={{ width: '50%' }}
              onClick={this.onConfirm}
              disabled={prefix.length < 2}
            />
            <Button
              text={localize[lang].RETURN_TO_MY_PROJECTS}
              type="primary"
              style={{ width: '50%' }}
              onClick={onCancel}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

MissingProjectFieldsModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  error: PropTypes.object,
  lang: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  projectTypes: PropTypes.array,
  style: PropTypes.object,
  text: PropTypes.string
};

export default MissingProjectFieldsModal;
