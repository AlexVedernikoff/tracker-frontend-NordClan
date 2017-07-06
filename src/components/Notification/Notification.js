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
          {this.props.message || "Lorem Ipsum Ekam Saedi Neppah"}
        </p>
      </div>
    );
  }
}

export default Notification;
