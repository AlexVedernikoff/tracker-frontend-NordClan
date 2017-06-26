import React, { Component } from 'react';
import { history } from './Router';
import { connect } from 'react-redux';

export default function authRedirect(Component, requiresAuth) {
  class AuthenticatedComponent extends Component {
    static propTypes = {
      authToken: PropTypes.string,
      dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
      this._checkAndRedirect();
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      if (!this.props.authToken && requiresAuth) {
        browserHistory.push('/login');
      }
    }

    render() {
      if (!this.props.authToken && requiresAuth) {
        return null;
      }
      if (this.props.authToken && !requiresAuth) {
        return null;
      }
      return (
        <Component {...this.props} />
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      authToken: localStorage.getItem('auth')
    };
  };

  return connect(mapStateToProps)(AuthenticatedComponent);
}
