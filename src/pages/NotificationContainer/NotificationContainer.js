import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as css from './NotificationContainer.scss';
import Notification from '../../components/Notification';

class NotificationContainer extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className={css.NotificationContainer}>
        {this.props.notifications
          ? this.props.notifications.map((notification, i) => {
            return <Notification notification={notification} />;
          })
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.Notifications.Notifications
});

NotificationContainer.propTypes = {
  notifications: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(NotificationContainer);
