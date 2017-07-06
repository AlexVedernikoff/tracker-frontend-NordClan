import React, { Component } from 'react';
import { IconError } from '../Icons';

class Notification extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <IconError style={{ width: 100, height: 100 }} />
      </div>
    );
  }
}

export default Notification;
