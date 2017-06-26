import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as css from './Login.scss';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import bg from './bg.jpg';
import { connect } from "react-redux";
import { doAuthentication } from "../../actions/Authentication";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    doAuthentication(this.state)(this.props.dispatch);
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
            <Button
              onClick={this.onSubmit}
              text="Войти"
              type="borderedInverse"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.Auth.errorMessage
  }
}

Login.propTypes = {
  doAuthentication: PropTypes.string
}

export default connect(mapStateToProps)(Login);
