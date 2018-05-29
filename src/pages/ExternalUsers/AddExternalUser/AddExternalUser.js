import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './AddExternalUser.scss';
import { addExternalUser, addExternalUserSuccess } from '../../../actions/ExternalUsers';
import { showNotification } from '../../../actions/Notifications';
import { finishLoading } from '../../../actions/Loading';

const initialState = {
  isModalOpen: false,
  name: '',
  email: '',
  expiredDate: '',
  errorMessage: ''
};

class AddExternalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
    this.validator = new Validator();
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };
  closeModal = () => {
    this.setState({ isModalOpen: false });
  };
  onInputChange = field => e => {
    this.setState({
      [field]: e.target.value
    });
  };
  handleDayToChange = date => {
    this.setState({
      expiredDate: date ? moment(date).format('YYYY-MM-DD') : ''
    });
  };
  validateEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  validateForm() {
    const { name, email, expiredDate } = this.state;
    return name.length >= 2 && this.validateEmail(email) && expiredDate;
  }

  addUser = () => {
    const { name, email, expiredDate } = this.state;
    this.setState({ errorMessage: null });
    this.props
      .addExternalUser({
        firstNameRu: name,
        login: email,
        expiredDate
      })
      .then(() => {
        this.setState({ ...initialState });
      })
      .catch(message => {
        this.setState({ errorMessage: this.getServerErrorMessage(message.message) });
      });
  };

  getServerValidationFieldName = param => {
    switch (param) {
      case 'login':
        return 'E-mail';
      default:
        return param;
    }
  };

  getServerValidationMessageString = type => {
    switch (type) {
      case 'unique violation':
        return 'уже занят';
      default:
        return type;
    }
  };

  getServerErrorMessage = message => {
    if (message.errors && message.errors.length) {
      let result = '';
      for (const error of message.errors) {
        result += `${this.getServerValidationFieldName(error.param)} ${this.getServerValidationMessageString(
          error.type
        )}`;
      }
      return result;
    }

    switch (message) {
      case 'Access denied':
        return 'Доступ запрещен';
      default:
        return `Непредвиденная ошибка на сервере: ${JSON.stringify(message)}`;
    }
  };

  render() {
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    const { isModalOpen, name, email, expiredDate, errorMessage } = this.state;
    const errorNotice = errorMessage ? <p style={{ color: 'red' }}>{errorMessage}</p> : null;

    const formattedDay = expiredDate ? moment(expiredDate).format('DD.MM.YYYY') : '';
    return (
      <div className={css.AddExternalUser}>
        <Button text="Добавить внешнего пользователя" type="primary" onClick={this.openModal} icon="IconPlus" />
        <Modal
          onRequestClose={this.closeModal}
          // // style={style || ReactModalStyles}
          contentLabel="modal"
          isOpen={isModalOpen}
          closeTimeoutMS={200}
        >
          <div className={css.container}>
            <h3 style={{ margin: 0 }}>Добавить внешнего пользователя</h3>
            <hr />
            {errorNotice}
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Имя пользователя:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        autoFocus
                        onChange={this.onInputChange('name')}
                        maxLength={100}
                        value={name}
                        name="exUserName"
                        placeholder="Введите имя пользователя"
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText="Длина менее 2 символов"
                      />
                    ),
                    'exUserName',
                    name.length < 2
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>E-mail:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        onChange={this.onInputChange('email')}
                        value={email}
                        name="exUserEmail"
                        placeholder="Введите электронную почту"
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText="Некорректный e-mail"
                      />
                    ),
                    'exUserEmail',
                    !!email.length && !this.validateEmail(email)
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Активен до</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <DatepickerDropdown
                    name="date"
                    value={formattedDay}
                    onDayChange={this.handleDayToChange}
                    disabledDataRanges={[{ before: new Date() }]}
                    placeholder="Введите дату"
                  />
                </Col>
              </Row>
            </label>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  text="Добавить пользователя"
                  disabled={!this.validateForm()}
                  onClick={this.addUser}
                />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  addExternalUser
};
AddExternalUser.propTypes = {
  addExternalUser: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(AddExternalUser);
