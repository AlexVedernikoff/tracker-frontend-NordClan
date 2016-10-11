import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from '../../redux/modules/auth';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import styles from './Login.scss'

styles.paper = {
  width: '20rem', 
  height: '20rem', 
  position: 'absolute', 
  top: 0, bottom: 0, left: 0, right: 0, 
  margin: 'auto', 
  backgroundColor: 'white', 
  textAlign: 'center'
}

@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const input = this.refs.username;
    this.props.login(input.getValue());
  }

  render() {
    const {user, logout} = this.props;

    return (
      <Paper className={styles.loginPage} style={styles.paper}>
        <Helmet title="Войти" />
        <AppBar title="Войти" showMenuIconButton={false}/>
        {!user &&
        <form className={styles.loginForm} onSubmit={this.handleSubmit}>
          <TextField
            hintText="Введите имя"
            floatingLabelText="Имя"
            ref="username"
            id="loginField"
          /><br/>
          <TextField
            hintText="Введите пароль"
            floatingLabelText="Пароль"
            type="password"
            id="passwordField"
          /><br/>
          <FlatButton
            type="submit"
            label="Войти"
            labelPosition="before"
            primary
          />
          <p style={{margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.54)'}}>Введите любое имя и нажмите войти</p>
        </form>
        }
        {user &&
        <div>
          <p>Вы вошли в систему как {user.name}.</p>

          <div>
             <FlatButton
                type="submit"
                label="Выйти"
                className="btn btn-danger" onClick={logout}
                secondary />
          </div>
        </div>
        }
      </Paper>
    );
  }
}

// const old = <button ><i className="fa fa-sign-out"/>{' '}Выйти</button>;
