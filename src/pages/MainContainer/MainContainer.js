import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import { connect } from 'react-redux';
import * as css from './MainContainer.scss';
import NotificationContainer from '../NotificationContainer';

class MainContainer extends Component {
  render () {
    const { notifications } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="app">
          {this.props.children}
          {notifications.length
            ? <NotificationContainer notifications={notifications} />
            : null}
        </div>
      </DragDropContextProvider>
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
