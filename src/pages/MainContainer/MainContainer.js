import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import * as css from './MainContainer.scss';

export default class MainContainer extends Component {
  static propTypes = {
    children: PropTypes.object
  };

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
