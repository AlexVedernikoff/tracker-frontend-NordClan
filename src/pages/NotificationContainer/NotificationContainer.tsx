import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './NotificationContainer.scss';
import Notification from '../../components/Notification';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class NotificationContainer extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={css.NotificationContainer}>
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.notifications
            ? this.props.notifications.map((notification, i) => {
              return (
                  <Notification
                    key={`notification-${i}`}
                    notification={notification}
                  />
              );
            })
            : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

NotificationContainer.propTypes = {
  notifications: PropTypes.array
};

export default NotificationContainer;
