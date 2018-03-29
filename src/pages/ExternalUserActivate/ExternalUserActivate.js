import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from '../Login/Login.scss';
import Logo from '../../components/Logo';
import ValidatedInput from '../../components/ValidatedInput';
import Validator from '../../components/ValidatedInput/Validator';
import Button from '../../components/Button';
import bg from '../Login/bg.jpg';
import { connect } from 'react-redux';
import { history } from '../../History';

class ExternalUserActivate extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      repeatPassword: ''
    };
    this.validator = new Validator();
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    console.log(this.props.params.exUserHash);
    return (
      <div className={css.formWrapper} style={{ backgroundImage: `url(${bg})` }}>
        <div className={css.loginForm}>
          <div className={css.logoWrapper}>
            <Logo onLight={false} style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }} />
          </div>
          <form onSubmit={this.onSubmit}>
            <div className={css.activatePasswordInfo}>
              Для активации придумайте пароль. Пароль должен содержать не менее 8 символов.
            </div>
            <div className={css.inputWrapper}>
              {this.validator.validate(
                (handleBlur, shouldMarkError) => (
                  <ValidatedInput
                    autoFocus
                    name="password"
                    type="password"
                    placeholder="Введите пароль"
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText="Пароль содержит менее 8 символов"
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
                    placeholder="Повторите пароль"
                    name="repeatPassword"
                    type="password"
                    onChange={this.handleChange}
                    onBlur={handleBlur}
                    shouldMarkError={shouldMarkError}
                    errorText="Пароли не совпадают"
                  />
                ),
                'repeatPassword',
                !!this.state.repeatPassword.length && this.state.repeatPassword !== this.state.password
              )}
            </div>
            <div className={css.buttonWrapper}>
              <Button
                onClick={this.onSubmit}
                htmlType="submit"
                text="Активировать"
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

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUserActivate);
