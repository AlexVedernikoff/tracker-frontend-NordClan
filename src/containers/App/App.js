/* Главный компонент приложения, проверяется авторизация пользователя, реализуется функционал тем для приложения */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from '../../redux/modules/auth';
import { push } from 'react-router-redux';
import config from '../../config';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import getColorTheme from '../../theme/theme';
import { asyncConnect } from 'redux-connect';
import AppHead from '../../components/AppHead/AppHead';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isAuthLoaded(getState())) {
      return dispatch(loadAuth());
    }
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static childContextTypes = {
    user: PropTypes.object
  }

  getChildContext() {
    return {
      user: this.props.user
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/tasks');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/login');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    require('./App.scss');
    const muiTheme = getMuiTheme(getColorTheme('cyan'));

    return (
      <div id="app">
        <Helmet {...config.app.head}/>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            {this.props.user !== null ? <AppHead /> : ''}
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
