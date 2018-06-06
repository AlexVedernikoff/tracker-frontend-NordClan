import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import Select from '../SelectDropdown';
import * as css from './MissingProjectFieldsModal.scss';
import { getErrorMessageByType } from '../../utils/ErrorMessages';

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
    const {
      style,
      onRequestClose,
      error: requestError,
      closeTimeoutMS,
      text,
      onConfirm,
      onCancel,
      projectTypes,
      ...other
    } = this.props;
    const { error, typeId, prefix } = this.state;
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    return (
      <Modal
        {...other}
        onRequestClose={onCancel}
        // style={style || ReactModalStyles}
        closeTimeoutMS={200 || closeTimeoutMS}
      >
        <div className={css.container}>
          <h3 style={{ margin: 0 }}>{text}</h3>
          <hr />
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Префикс проекта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                {this.validator.validate(
                  (handleBlur, shouldMarkError) => (
                    <ValidatedInput
                      placeholder="Префикс проекта"
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
                <p>Тип проекта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  name="performer"
                  placeholder="Выберите тип проекта"
                  multi={false}
                  noResultsText="Нет результатов"
                  backspaceRemoves={false}
                  options={projectTypes.map(type => ({ value: type.id, label: type.name }))}
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
            <Button text="Вернуться в «Мои проекты»" type="primary" style={{ width: '50%' }} onClick={onCancel} />
          </div>
        </div>
      </Modal>
    );
  }
}

MissingProjectFieldsModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  error: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  projectTypes: PropTypes.array,
  style: PropTypes.object,
  text: PropTypes.string
};

export default MissingProjectFieldsModal;
