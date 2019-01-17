import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './Auth.json';
import * as css from './Auth.scss';
import ValidatedInput from '../../../../components/ValidatedInput';
import Validator from '../../../../components/ValidatedInput/Validator';
import validateEmail from '../../../../helpers/EmailValidator';
import Button from '../../../Button';

/* eslint-disable no-unused-vars */
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';

const validationRules = {
  email: value => {
    return value && validateEmail(value);
  },
  password: value => {
    return !!(value && value.length);
  },
  server: value => {
    return !!(value && value.length);
  },
  username: value => {
    return !!(value && value.length);
  }
};

class AuthForm extends Component {
  static propTypes = {
    authData: PropTypes.object,
    authDataStep: PropTypes.object,
    isJiraAuthorizeError: PropTypes.any,
    jiraCaptachaLink: PropTypes.any,
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.validator = new Validator();
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  getErrors() {
    const errors = {};

    const { authData } = this.props;
    for (const field in authData) {
      if (validationRules[field]) {
        const fieldHasError = !validationRules[field](authData[field]);
        errors[field] = fieldHasError;

        if (fieldHasError && !errors.hasError) {
          errors.hasError = true;
        }
      }
    }

    return errors;
  }

  render() {
    const { lang, nextStep, onChange, authData, isJiraAuthorizeError, jiraCaptachaLink } = this.props;
    const formLayout = {
      firstCol: 3,
      secondCol: 9
    };
    const errors = this.getErrors();
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{localize[lang].AUTH}</p>
        </h3>
        <hr />
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].SERVER}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder={localize[lang].SERVER}
                    onChange={e => onChange('server', e)}
                    value={authData.server}
                    name="server"
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].FIELD_IS_NOT_FILLED}
                  />
                ),
                'server',
                errors.server
              )}
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].USERNAME}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder={localize[lang].USERNAME}
                    onChange={e => onChange('username', e)}
                    value={authData.username}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].FIELD_IS_NOT_FILLED}
                  />
                ),
                'username',
                errors.username
              )}
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].PASSWORD}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder={localize[lang].PASSWORD}
                    type="password"
                    onChange={e => onChange('password', e)}
                    value={authData.password}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].FIELD_IS_NOT_FILLED}
                  />
                ),
                'password',
                errors.password
              )}
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col
              xs={12}
              sm={formLayout.firstCol}
              className={classnames(css.leftColumn, css.emailLabel)}
              data-tip={localize[lang].EMAIL_FIELD_TIP}
            >
              {localize[lang].EMAIL}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder={localize[lang].EMAIL}
                    label="email"
                    onChange={e => onChange('email', e)}
                    value={authData.email}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].FIELD_IS_NOT_FILLED}
                  />
                ),
                'email',
                errors.email
              )}
            </Col>
          </Row>
        </label>
        {isJiraAuthorizeError &&
          jiraCaptachaLink && (
            <div data-tip={localize[lang].LOGIN_VIA_JIRA_TIP} className={css.jiraCaptchaLink}>
              <a href={jiraCaptachaLink} target="_blank">
                {localize[lang].LOGIN_VIA_JIRA}
              </a>
            </div>
          )}
        <div className={css.buttonsContainer}>
          <Button
            text={localize[lang].GO_AHEAD}
            disabled={errors.hasError}
            onClick={() => nextStep(authData)}
            type="green"
          />
        </div>
      </div>
    );
  }
}

export default AuthForm;
