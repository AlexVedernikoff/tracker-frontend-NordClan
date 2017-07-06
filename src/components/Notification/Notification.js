import React, { Component } from 'react';
import { IconError } from '../Icons';
import * as css from './Notification.scss';

class Notification extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={css.Notification}>
        <IconError style={{ width: 50, height: 50 }} />
        <p className={css.NotificationMessage}>
          {this.props.notification.message}
        </p>
      </div>
    );
  }
}

export default Notification;
