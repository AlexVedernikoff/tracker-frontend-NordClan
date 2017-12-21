import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';
import PortfolioEditor from './PortfolioEditor';


export default class Settings extends Component {
  render () {
    return <div>
        <ParticipantEditor />
        <StatusEditor />
        <PortfolioEditor />
      </div>;
  }
}
