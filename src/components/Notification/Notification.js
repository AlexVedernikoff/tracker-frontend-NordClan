import React, { Component } from 'react';
import { IconError } from '../Icons';
import * as css from './Notification.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Notification extends Component {
  static propTypes = {
    notification: PropTypes.object
  };

  static defaultProps = {
    notification: {
      type: 'primary'
    }
  }

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
    const { type } = this.props.notification;

    return (
      <div
        onClick={this.hideNotification}
        className={classnames({
          [css.Notification]: true,
          [css.hide]: !this.state.isShown,
          [css[type]]: true
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

export default Notification;
