import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Login.scss';
import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import bg from './bg.jpg';
import { connect } from 'react-redux';
import { history } from '../../App';
import { doAuthentication } from '../../actions/Authentication';

class Login extends Component {
  static propTypes = {
    doAuthentication: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: ''
    };
  }

  componentDidUpdate () {
    if (this.props.isLoggedIn) {
      history.push('/projects');
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { doAuthentication } = this.props;//eslint-disable-line
    doAuthentication(this.state);
  };

  render () {
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
          <form onSubmit={this.onSubmit}>
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
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth: { isLoggedIn } }) => ({
  isLoggedIn
});

const mapDispatchToProps = {
  doAuthentication
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
