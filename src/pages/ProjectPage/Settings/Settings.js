import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';
import PortfolioEditor from './PortfolioEditor';
import GitLabEditor from './GitLabEditor';

export default class Settings extends Component {
  render() {
    return (
      <div>
        <ParticipantEditor />
        <StatusEditor />
        <PortfolioEditor />
        <GitLabEditor />
      </div>
    );
  }
}
