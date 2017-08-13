import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router';

export default class AuthRoute extends Component {
  static propTypes = {
    allowed: PropTypes.bool.isRequired,
    children: PropTypes.array,
    component: PropTypes.func.isRequired,
    otherwise: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  };

  render () {
    const {
      path,
      component,
      allowed,
      otherwise,
      children,
      ...otherProps
    } = this.props;

    if (allowed) {
      return (
        <Route path={path} component={component} {...otherProps} >
          {children}
        </Route>
      );
    }
    return (
      <Redirect to={otherwise}/>
    );
  }
}
