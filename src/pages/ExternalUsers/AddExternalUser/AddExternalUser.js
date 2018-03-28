import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import Input from '../../../components/Input';
import moment from 'moment';
import { connect } from 'react-redux';
import Checkbox from '../../../components/Checkbox';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './AddExternalUser.scss';
import { addExternalUser } from '../../../actions/ExternalUsers';
class AddExternalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: '',
      email: '',
      isActive: false,
      expiredDate: ''
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
      expiredDate: date ? moment(date).format() : ''
    });
  };
  onCheckboxChange = () => {
    this.setState({ isActive: !this.state.isActive });
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
    const { name, email, expiredDate, isActive } = this.state;
    this.setState({ isModalOpen: false }, () => {
      this.props.addExternalUser({
        name,
        email,
        expiredDate,
        isActive
      });
    });
  };
  render() {
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    const { isModalOpen, name, email, expiredDate } = this.state;
    const formattedDay = expiredDate ? moment(expiredDate).format('DD.MM.YYYY') : '';
    return (
      <div>
        <Button text="Добавить внешнего пользователя" type="primary" onClick={this.openModal} />
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
                  <p>Активность:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Checkbox onChange={this.onCheckboxChange} />
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
