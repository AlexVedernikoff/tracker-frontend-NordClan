import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from '../../actions/auth';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

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
    const styles = require('./Login.scss');
    return (
      <Paper className={styles.loginPage}>
        <Helmet title="Войти" />
        <AppBar title="Войти" showMenuIconButton={false}/>
        {!user &&
        <form style={{marginTop: '2rem'}} onSubmit={this.handleSubmit}>
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
          <p className={styles.loginTextHint}>Введите любой имя и нажмите войти</p>
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
