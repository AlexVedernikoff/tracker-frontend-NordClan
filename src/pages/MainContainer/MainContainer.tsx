import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MainContainer.scss';
import NotificationContainer from '../NotificationContainer';

class MainContainer extends Component<any, any> {
  render() {
    const { notifications } = this.props;

    return (
      <div id="app">
        {this.props.children}
        {notifications.length ? <NotificationContainer notifications={notifications} /> : null}
      </div>
    );
  }
}

MainContainer.propTypes = {
  children: PropTypes.object,
  notifications: PropTypes.array
};

const mapStateToProps = state => ({
  notifications: state.Notifications.Notifications
});

export default connect(mapStateToProps)(MainContainer);
