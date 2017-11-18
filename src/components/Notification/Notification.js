import React, { Component } from 'react';
import { IconError } from '../Icons';
import * as css from './Notification.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Notification extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShown: true
    };
  }

  hideNotification = () => {
    this.setState({
      isShown: false
    });
  }

  render () {
    return (
      <div
        onClick={this.hideNotification}
        className={classnames({
          [css.Notification]: true,
          [css.hide]: !this.state.isShown,
          [css.error]: this.props.notification.type === 'error'
        })}
      >
        <IconError className={css.MainIcon} />
        <p className={css.NotificationMessage}>
          {this.props.notification.message}
        </p>
      </div>
    );
  }
}

Notification.propTypes = {
  notification: PropTypes.object
};

export default Notification;
