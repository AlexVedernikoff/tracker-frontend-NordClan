import React, { Component } from 'react';
// import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './ExternalUsersTable.scss';
import ExternalUsersTableHeader from './ExternalUsersTableHeader';
import ExternalUsersTableRow from './ExternalUsersTableRow';
import mockEU from '../mockEU';
class ExternalUsersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exUsers: mockEU
    };
  }
  render() {
    return (
      <div className={css.ExternalUsersTable}>
        <ExternalUsersTableHeader />
        {this.state.exUsers.map((item, i) => <ExternalUsersTableRow key={`EU-${i}`} exUser={item} />)}
      </div>
    );
  }
}

export default ExternalUsersTable;
