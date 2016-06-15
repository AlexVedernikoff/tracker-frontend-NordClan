import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
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
      <Paper className={styles.loginPage}
             style={{width: '20rem', height: '20rem', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', backgroundColor: 'white', textAlign: 'center'}}>
        <Helmet title="Login"/>
        <AppBar title="Login" showMenuIconButton={false}/>
        {!user &&
        <div style={{marginTop: '2rem'}}>
          <TextField
            hintText="Enter name"
            floatingLabelText="Name"
            ref="username"
          /><br/>
          <TextField
            hintText="Enter password"
            floatingLabelText="Password"
            type="password"
          /><br/>
          <FlatButton
            label="Sign in"
            labelPosition="before"
            primary
            icon={<ActionAndroid />}
            onClick={this.handleSubmit}
          />
          <p style={{margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.54)'}}>P.S. please, enter any name and press button</p>
        </div>
        }
        {user &&
        <div>
          <p>You are currently logged in as {user.name}.</p>

          <div>
            <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out"/>{' '}Log Out</button>
          </div>
        </div>
        }
      </Paper>
    );
  }
}
