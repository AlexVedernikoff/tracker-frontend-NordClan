import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';

export default class Settings extends Component {
  render () {
    return <div>
      <ParticipantEditor />
      <StatusEditor />
    </div>;
  }
}
