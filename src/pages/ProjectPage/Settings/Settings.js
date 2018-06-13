import React, { Component } from 'react';
import ParticipantEditor from './ParticipantEditor';
import StatusEditor from './StatusEditor';
import PortfolioEditor from './PortfolioEditor';
import GitLabEditor from './GitLabEditor';
import TypeEditor from './TypeEditor';
import QaEditor from './QaEditor';

export default class Settings extends Component {
  render() {
    return (
      <div>
        <ParticipantEditor />
        <TypeEditor />
        <QaEditor />
        <StatusEditor />
        <PortfolioEditor />
        <GitLabEditor />
      </div>
    );
  }
}
