import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Login.scss';
import Logo from '../../components/Logo';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import Button from '../../components/Button';
import bg from './bg.jpg';
import { connect } from 'react-redux';
import { history } from '../../History';
import { doAuthentication, clearRedirect } from '../../actions/Authentication';
import Title from 'react-title-component';
import { getAuthUrl } from '../../utils/Keycloak';

class Login extends Component {
  static propTypes = {
    clearRedirect: PropTypes.func.isRequired,
    defaultRedirectPath: PropTypes.string,
    doAuthentication: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
    redirectPath: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      ssoUrl: getAuthUrl()
    };
    this.validator = new Validator();
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      const { redirectPath, defaultRedirectPath } = this.props;
      const nextLocation = redirectPath || defaultRedirectPath;
      history.replace(nextLocation);
      if (redirectPath) {
        this.props.clearRedirect();
      }
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { doAuthentication } = this.props; //eslint-disable-line
    doAuthentication(this.state);
  };

  render() {
    return (
      <div className={css.formWrapper} style={{ backgroundImage: `url(${bg})` }}>
        <Title render={'SimTrack - Login'} />
        <div className={css.loginForm}>
          <div className={css.logoWrapper}>
            <Logo onLight={false} style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }} />
          </div>
          <form onSubmit={this.onSubmit}>
            {this.props.errorMessage ? <div className={css.errorMessage}>{this.props.errorMessage}</div> : null}
            <div className={css.inputWrapper}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    autoFocus
                    name="username"
                    placeholder="Имя пользователя"
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText="Поле не должно быть пустым"
                  />
                ),
                'taskName',
                this.state.username.length < 1
              )}
            </div>
            <div className={css.inputWrapper}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    placeholder="Пароль"
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText="Поле не должно быть пустым"
                  />
                ),
                'taskName',
                this.state.password.length < 1
              )}
            </div>
            <div className={css.buttonWrapper}>
              <Button
                onClick={this.onSubmit}
                htmlType="submit"
                text="Войти"
                type="borderedInverse"
                disabled={!(this.state.username && this.state.password)}
              />
              <p>
                <a href={this.state.ssoUrl}>Авторизация через SSO</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth: { isLoggedIn, redirectPath, defaultRedirectPath, errorMessage } }) => ({
  isLoggedIn,
  redirectPath,
  defaultRedirectPath,
  errorMessage
});

const mapDispatchToProps = {
  doAuthentication,
  clearRedirect
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
