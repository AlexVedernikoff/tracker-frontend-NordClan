import React from 'react';
import * as css from './Login.scss';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import bg from './bg.jpg';

const Login = () =>
  <div className={css.formWrapper} style={{ backgroundImage: `url(${bg})` }}>
    <div className={css.loginForm}>
      <div className={css.logoWrapper}>
        <Logo
          onLight={false}
          style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }}
        />
      </div>
      <div className={css.inputWrapper}>
        <Input
          placeholder="Имя пользователя"
          ref={ref => (this.username = ref)}
        />
      </div>
      <div className={css.inputWrapper}>
        <Input
          placeholder="Пароль"
          type="password"
          ref={ref => (this.password = ref)}
        />
      </div>
      <div className={css.buttonWrapper}>
        <Button text="Войти" type="borderedInverse" />
      </div>
    </div>
  </div>;

export default Login;
