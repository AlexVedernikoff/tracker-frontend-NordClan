import React, { Component } from 'react';
import * as css from './Login.scss';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import bg from './bg.jpg';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div
        className={css.formWrapper}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className={css.loginForm}>
          <div className={css.logoWrapper}>
            <Logo
              onLight={false}
              style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }}
            />
          </div>
          <div className={css.inputWrapper}>
            <Input
              name="username"
              placeholder="Имя пользователя"
              onChange={this.handleChange}
            />
          </div>
          <div className={css.inputWrapper}>
            <Input
              name="password"
              placeholder="Пароль"
              type="password"
              onChange={this.handleChange}
            />
          </div>
          <div className={css.buttonWrapper}>
            <Button text="Войти" type="borderedInverse" />
          </div>
        </div>
      </div>
    );
  }
}
