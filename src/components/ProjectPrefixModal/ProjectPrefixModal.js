import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import * as css from './ProjectPrefixModal.scss';
import { getErrorMessageByType } from '../../utils/ErrorMessages';

class ProjectPrefixModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: ''
    };
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
  onPrefixInputChange = e => this.setState({ prefix: e.target.value });

  render() {
    const { style, onRequestClose, closeTimeoutMS, text, onConfirm, onCancel, ...other } = this.props;
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
                <Input placeholder="Префикс проекта" onChange={this.onPrefixInputChange} />
              </Col>
            </Row>
          </label>
          <p style={{ color: 'red' }}>{this.getFieldError('prefix')}</p>
        </div>
        <Button
          text="ОК"
          type="green"
          style={{ width: '50%' }}
          onClick={onConfirm(this.state.prefix)}
          disabled={this.state.prefix.length < 2}
        />
        <Button text="Вернуться в &quot;Мои проекты&quot;" type="primary" style={{ width: '50%' }} onClick={onCancel} />
      </Modal>
    );
  }
}

ProjectPrefixModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  error: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  style: PropTypes.object,
  text: PropTypes.string
};

export default ProjectPrefixModal;
