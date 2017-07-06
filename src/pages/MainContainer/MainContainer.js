import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import * as css from './MainContainer.scss';
import Notification from '../../components/Notification';

export default class MainContainer extends Component {
  render () {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div id="app">
          {this.props.children}
        </div>
      </DragDropContextProvider>
    );
  }
}

MainContainer.propTypes = {
  children: PropTypes.object
};
