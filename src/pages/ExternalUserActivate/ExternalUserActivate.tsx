import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from '../Login/Login.modules.scss';
import Logo from '../../components/Logo';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import Button from '../../components/Button';
import { activateExternalUser } from '../../actions/ExternalUsers';
import bg from '../Login/bg.jpg';
import { connect } from 'react-redux';
import localize from './externalUserActivate.json';

type ExternalUserActivateProp = {
  lang: string,
  activateExternalUser: (...args: any) => any,
  params: { exUserToken: any }
};

type ExternalUserActivateState = {
  password: string,
  repeatPassword: string
};

class ExternalUserActivate extends Component<ExternalUserActivateProp, ExternalUserActivateState> {

  private validator = new Validator();

  public state: ExternalUserActivateState = {
    password: '',
    repeatPassword: ''
  };

  static propTypes = {
    activateExternalUser: PropTypes.func,
    lang: PropTypes.string,
    params: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  handleChange = event => {
    const {name, value} = event.target;
    this.setState({ [name]: value } as any);
  };

  onSubmit = e => {
    e.preventDefault();
    const { activateExternalUser, params: {exUserToken} } = this.props;
    const { password } = this.state;
    activateExternalUser(exUserToken, password);
  };

  render() {
    const { lang } = this.props;
    return (
      <div className={css.formWrapper} style={{ backgroundImage: `url(${bg})` }}>
        <div className={css.loginForm}>
          <div className={css.logoWrapper}>
            <Logo onLight={false} style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }} />
          </div>
          <form onSubmit={this.onSubmit}>
            <div className={css.activatePasswordInfo}>{localize[lang].ACTIVE_PASSWORD_INFO}</div>
            <div className={css.inputWrapper}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    autoFocus
                    name="password"
                    type="password"
                    placeholder={localize[lang].PASSWORD}
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].PASSWORD_MESSAGE_ERROR}
                  />
                ),
                'password',
                this.state.password.length < 8
              )}
            </div>
            <div className={css.inputWrapper}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder={localize[lang].PASSWORD_REPEAT}
                    name="repeatPassword"
                    type="password"
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText={localize[lang].PASSWORD_REPEAT_MESSAGE_ERROR}
                  />
                ),
                'repeatPassword',
                this.state.repeatPassword !== this.state.password
              )}
            </div>
            <div className={css.buttonWrapper}>
              <Button
                onClick={this.onSubmit}
                htmlType="submit"
                text={localize[lang].ACTIVATE}
                type="borderedInverse"
                disabled={!(this.state.password.length >= 8 && this.state.repeatPassword === this.state.password)}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  activateExternalUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExternalUserActivate);
