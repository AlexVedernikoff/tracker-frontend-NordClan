import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';
import PortfolioEditor from './PortfolioEditor';
import GitLabEditor from './GitLabEditor';
import TypeEditor from './TypeEditor';

export default class Settings extends Component {
  render() {
    return (
      <div>
        <ParticipantEditor />
        <TypeEditor />
        <StatusEditor />
        <PortfolioEditor />
        <GitLabEditor />
      </div>
    );
  }
}
