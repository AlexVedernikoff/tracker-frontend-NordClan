import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ValidatedInput from '../../../components/ValidatedInput';
import Validator from '../../../components/ValidatedInput/Validator';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import css from './AddExternalUser.scss';
import { addExternalUser } from '../../../actions/ExternalUsers';
import cloneDeep from 'lodash/cloneDeep';
import localize from './addExternalUser.json';
import { getExternalUserTypeOptions } from '../utils';
import { replaceSymbolsForNameRuInput, replaceDuplicateSymbol, replaceSymbolsForNameEnInput } from '../../../utils/validators/filterInputSymbols';
import flowRight from 'lodash/flowRight';

type AddExternalUserProps = {
  lang: 'en' | 'ru',
  addExternalUser: (...args: any[]) => any,
};

const initialState = {
  isModalOpen: false,
  name: '',
  lastName: '',
  nameEn: '',
  lastNameEn: '',
  type: null,
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

const validationProps = {
  requiredNameLength: 2,
  requiredLastnameLength: 2,
}

class AddExternalUser extends Component<AddExternalUserProps, any> {
  validator = new Validator();

  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
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

  onInputNameRuChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = flowRight(replaceDuplicateSymbol, replaceSymbolsForNameRuInput)(e.target.value);
    this.setState({
      [field]: value
    });

    this.setError(field, '', false, false);
  };

  onInputNameEnChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = flowRight(replaceDuplicateSymbol, replaceSymbolsForNameEnInput)(e.target.value);
    this.setState({
      [field]: value
    });

    this.setError(field, '', false, false);
  };

  onTypeChange = e => {
    this.setState({
      type: e.value
    });

    this.setError('type', '', false, false);
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
      if (this.state.errors.email.error) return;
      if (email.length < 2) {
        this.setError('email', localize[lang].MUST_BE_FILLED, true, false);
      } else {
        this.setError('email', localize[lang].INCORRECT_EMAIL, true, false);
      }
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
    const { name, email, expiredDate, type } = this.state;
    return name.length >= 2 && this.validateEmail(email) && moment().diff(expiredDate, 'days') <= 0 && !!type;
  }

  addUser = () => {
    const {
      name,
      lastName,
      nameEn,
      lastNameEn,
      email,
      type,
      description,
      expiredDate
    } = this.state;
    this.setState({ errorMessage: null });
    this.props
      .addExternalUser({
        firstNameRu: name,
        lastNameRu: lastName,
        firstNameEn: nameEn,
        lastNameEn,
        login: email,
        externalUserType: type,
        description: description,
        expiredDate
      })
      .then(() => {
        this.setState({ ...initialState });
        this.validator.resetTouched();
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
      firstCol: 4,
      secondCol: 8
    };
    const { lang } = this.props;
    const {
      isModalOpen,
      name,
      lastName,
      nameEn,
      lastNameEn,
      email,
      type,
      description,
      expiredDate,
      errors,
      errorMessage
    } = this.state;
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
            <h3 style={{ margin: 0 }}>{localize[lang].ADD_EXTERNAL_USER_TITLE}</h3>
            <hr />
            {errorNotice}
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].USERNAME}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        autoFocus
                        onChange={this.onInputNameRuChange('name')}
                        maxLength={100}
                        value={name}
                        name="exUserName"
                        placeholder={localize[lang].ENTER_YOUR_USERNAME}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                      />
                    ),
                    'exUserName',
                    name.length < validationProps.requiredNameLength
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].USER_LASTNAME}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        onChange={this.onInputNameRuChange('lastName')}
                        maxLength={100}
                        value={lastName}
                        name="exUserLastName"
                        placeholder={localize[lang].ENTER_YOUR_USER_LASTNAME}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                      />
                    ),
                    'exUserLastName',
                    lastName.length < validationProps.requiredLastnameLength
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].USERNAME_EN}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        onChange={this.onInputNameEnChange('nameEn')}
                        maxLength={100}
                        value={nameEn}
                        name="exUserNameEn"
                        placeholder={localize[lang].ENTER_YOUR_USERNAME}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                      />
                    ),
                    'exUserNameEn',
                    nameEn.length < validationProps.requiredNameLength
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].USER_LASTNAME_EN}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        onChange={this.onInputNameEnChange('lastNameEn')}
                        maxLength={100}
                        value={lastNameEn}
                        name="exUserLastNameEn"
                        placeholder={localize[lang].ENTER_YOUR_USER_LASTNAME}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                      />
                    ),
                    'exUserLastNameEn',
                    lastNameEn.length < validationProps.requiredLastnameLength
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>E-mail:</p>
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
                        isErrorBack={errors.email.serverError}
                      />
                    ),
                    'exUserEmail',
                    errors.email.error || (!this.validateEmail(email))
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].Type}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        name="externalUserRole"
                        elementType="select"
                        value={type}
                        options={getExternalUserTypeOptions(lang)}
                        onBlur={handleBlur}
                        placeholder={localize[lang].CHOOSE_TYPE}
                        onDayChange={this.handleDayToChange}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                        onChange={this.onTypeChange}
                      />
                    ),
                    'externalUserRole',
                    !type
                  )}
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{' '}{localize[lang].DESCRIPTION}</p>
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
                  <p><span className={css.mark}>*&ensp;</span>{localize[lang].ACTIVE_BEFORE}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        name="date"
                        elementType="date"
                        value={formattedDay}
                        onBlur={handleBlur}
                        onDayChange={this.handleDayToChange}
                        disabledDataRanges={[{ before: new Date() }]}
                        placeholder={localize[lang].ENTER_DATE}
                        shouldMarkError={shouldMarkError}
                        errorText={localize[lang].MUST_BE_FILLED}
                      />
                    ),
                    'exUserDate',
                    !expiredDate || moment().diff(expiredDate, 'days') > 0
                  )}
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

(AddExternalUser as any).propTypes = {
  addExternalUser: PropTypes.func,
  lang: PropTypes.string
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExternalUser);
