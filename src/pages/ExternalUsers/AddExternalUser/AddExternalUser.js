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
import cloneDeep from 'lodash/cloneDeep';
import localize from './addExternalUser.json';

const initialState = {
  isModalOpen: false,
  name: '',
  email: '',
  description: '',
  expiredDate: '',
  errorMessage: '',
  errors: {
    email: {
      error: false,
      serverError: false,
      text: ''
    }
  }
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
    // reset field errors
    this.setError(field, '', false, false);
  };
  handleDayToChange = date => {
    this.setState({
      expiredDate: date ? moment(date).format('YYYY-MM-DD') : ''
    });
  };
  validateEmail = email => {
    const { lang } = this.props;
    const re = /\S+@\S+\.\S+/;
    const result = re.test(email);

    if (!result) {
      if (!this.state.errors.email.error) {
        this.setError('email', localize[lang].INCORRECT_EMAIL, true, false);
      }
    } else if (this.state.errors.email.error && !this.state.errors.email.serverError) {
      this.setError('email', '', false);
    }
    return result;
  };

  setError = (key, text = '', error = false, serverError = false) => {
    const updatedErrors = cloneDeep(this.state.errors);
    updatedErrors[key] = {
      error,
      serverError,
      text
    };

    this.setState({
      errors: updatedErrors
    });
  };

  validateForm() {
    const { name, email, expiredDate } = this.state;
    return name.length >= 2 && this.validateEmail(email) && expiredDate;
  }

  addUser = () => {
    const { name, email, description, expiredDate } = this.state;
    this.setState({ errorMessage: null });
    this.props
      .addExternalUser({
        firstNameRu: name,
        login: email,
        description: description,
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
    const { lang } = this.props;
    switch (type) {
      case 'unique violation':
        return localize[lang].UNIQUE_VIOLATION;
      default:
        return type;
    }
  };

  getServerErrorMessage = message => {
    const { lang } = this.props;
    if (message.errors && message.errors.length) {
      let result = '';
      for (const error of message.errors) {
        const errorString = `${this.getServerValidationFieldName(error.param)} ${this.getServerValidationMessageString(
          error.type
        )}`;
        if (error.param === 'login') {
          this.setError('email', errorString, true, true);
          return false;
        }
        result += errorString;
      }
      return result;
    }

    switch (message) {
      case 'Access denied':
        return localize[lang].ACCESS_DENIED;
      default:
        return `${localize[lang].ERROR_ON_SERVER} ${JSON.stringify(message)}`;
    }
  };

  render() {
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    const { lang } = this.props;
    const { isModalOpen, name, email, description, expiredDate, errors, errorMessage } = this.state;
    const errorNotice = errorMessage ? <p style={{ color: 'red' }}>{errorMessage}</p> : null;

    const formattedDay = expiredDate ? moment(expiredDate).format('DD.MM.YYYY') : '';
    return (
      <div className={css.AddExternalUser}>
        <Button text={localize[lang].ADD_EXTERNAL_USER} type="primary" onClick={this.openModal} icon="IconPlus" />
        <Modal
          onRequestClose={this.closeModal}
          // // style={style || ReactModalStyles}
          contentLabel="modal"
          isOpen={isModalOpen}
          closeTimeoutMS={200}
        >
          <div className={css.container}>
            <h3 style={{ margin: 0 }}>{localize[lang].ADD_EXTERNAL_USER}</h3>
            <hr />
            {errorNotice}
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].USERNAME}</p>
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
                        placeholder={localize[lang].ENTER_YOUR_USERNAME}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].ENTER_YOUR_USERNAME}
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
                        placeholder={localize[lang].ENTER_YOUR_EMAIL}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={errors.email.text}
                      />
                    ),
                    'exUserEmail',
                    errors.email.error || (!!email.length && !this.validateEmail(email))
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
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        onChange={this.onInputChange('description')}
                        value={description}
                        name="exUserDescription"
                        placeholder={localize[lang].ENTER_YOUR_DESCRIPTION}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].DESCRIPTION_MAXLENGTH}
                      />
                    ),
                    'exUserDescription',
                    description.length > 5000
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].ACTIVE_BEFORE}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <DatepickerDropdown
                    name="date"
                    value={formattedDay}
                    onDayChange={this.handleDayToChange}
                    disabledDataRanges={[{ before: new Date() }]}
                    placeholder={localize[lang].ENTER_DATE}
                  />
                </Col>
              </Row>
            </label>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  text={localize[lang].ADD_USER}
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  addExternalUser
};

AddExternalUser.propTypes = {
  addExternalUser: PropTypes.func
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExternalUser);
